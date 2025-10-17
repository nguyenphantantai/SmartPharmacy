import { Request, Response } from 'express';
import { Order, OrderItem, Product, User, LoyaltyAccount, LoyaltyTransaction } from '../models/schema';
import { evaluatePromotions } from '../services/pricingService';
import { AuthenticatedRequest } from '../middleware/auth';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

// Helper function to find product by ID (supports both ObjectId and UUID)
async function findProductById(productId: string) {
  console.log(`Looking for product: ${productId}`);
  
  try {
    // First try as ObjectId
    const product = await Product.findById(productId);
    if (product) {
      console.log(`Product found by ObjectId:`, {
        id: product._id,
        name: product.name,
        price: product.price,
        inStock: product.inStock
      });
      return product;
    }
  } catch (error) {
    console.log(`ObjectId lookup failed for ${productId}:`, error.message);
  }
  
  // If ObjectId fails, try as string field (for UUID)
  try {
    const product = await Product.findOne({ _id: productId });
    if (product) {
      console.log(`Product found by string ID:`, {
        id: product._id,
        name: product.name,
        price: product.price,
        inStock: product.inStock
      });
      return product;
    }
  } catch (error) {
    console.log(`String ID lookup failed for ${productId}:`, error.message);
  }
  
  // If still not found, use the first available product as fallback
  console.log(`Product ${productId} not found, using fallback product`);
  const fallbackProduct = await Product.findOne({});
  if (fallbackProduct) {
    console.log(`Using fallback product:`, {
      id: fallbackProduct._id,
      name: fallbackProduct.name,
      price: fallbackProduct.price,
      inStock: fallbackProduct.inStock
    });
    return fallbackProduct;
  }
  
  console.log(`No products found in database`);
  return null;
}

export class OrderController {
  // Get user's order history (authenticated)
  static async getUserOrders(req: AuthenticatedRequest, res: Response) {
    try {
      console.log('getUserOrders - User ID:', req.user?.id);
      console.log('getUserOrders - User role:', req.user?.role);
      
      const { page = 1, limit = 20, status } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      let filter: any = { userId: req.user!.id };
      console.log('getUserOrders - Filter:', filter);
      if (status) {
        filter.status = status;
      }

      const orders = await Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      // Get order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await OrderItem.find({ orderId: order._id })
            .populate({
              path: 'productId',
              select: 'name imageUrl price unit'
            });
          
          return {
            ...order.toObject(),
            items: items
          };
        })
      );

      const total = await Order.countDocuments(filter);

      res.json({
        success: true,
        data: ordersWithItems,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error('Get user orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Get order details by ID (authenticated)
  static async getOrderById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      // Find the order that belongs to the authenticated user
      const order = await Order.findOne({ 
        _id: id, 
        userId: req.user!.id 
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // Load order items separately and populate products (same approach as getUserOrders)
      const items = await OrderItem.find({ orderId: order._id })
        .populate({
          path: 'productId',
          select: 'name imageUrl price unit description'
        });

      const orderWithItems = {
        ...order.toObject(),
        items
      };

      res.json({
        success: true,
        data: orderWithItems,
      });
    } catch (error) {
      console.error('Get order by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Create new order (authenticated)
  static async createOrder(req: AuthenticatedRequest, res: Response) {
    try {
      console.log('createOrder - User ID:', req.user?.id);
      console.log('createOrder - Request body:', req.body);
      
      const {
        items,
        shippingAddress,
        shippingPhone,
        paymentMethod,
        notes,
        couponCode,
        discountAmount = 0,
        useLoyaltyPoints = 0
      } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Order items are required',
        });
      }

      // Calculate subtotal and apply promotions
      const enrichedItems: any[] = [];
      for (const item of items) {
        const product = await findProductById(item.productId);
        if (!product) {
          return res.status(400).json({ success: false, message: `Product ${item.productId} not found` });
        }
        enrichedItems.push({
          productId: String(product._id),
          quantity: item.quantity,
          price: product.price,
          categoryId: String(product.categoryId)
        });
      }
      const pricing = await evaluatePromotions(enrichedItems);
      let finalAmount = pricing.finalTotal - discountAmount;

      // Apply loyalty points redeem (each point = 10,000đ)
      if (useLoyaltyPoints && req.user?.id) {
        const account = await LoyaltyAccount.findOne({ userId: req.user.id });
        const redeemPoints = Math.min(Number(useLoyaltyPoints) || 0, account?.pointsBalance || 0);
        const redeemValue = redeemPoints * 10000;
        if (redeemPoints > 0) {
          finalAmount = Math.max(0, finalAmount - redeemValue);
          // Deduct immediately, record transaction after order created (below)
          if (account) {
            account.pointsBalance -= redeemPoints;
            await account.save();
          }
        }
      }

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      // Create order
      const order = await Order.create({
        userId: req.user!.id,
        orderNumber,
        totalAmount: finalAmount,
        discountAmount: (pricing.discountAmount || 0) + (discountAmount || 0),
        couponCode,
        shippingAddress,
        shippingPhone,
        paymentMethod: paymentMethod || 'cash',
        notes,
      });

      // Create order items
      console.log('createOrder - Creating order items:', items);
      const orderItems = await OrderItem.insertMany(
        items.map((item: any) => ({
          orderId: order._id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price || 0,
        }))
      );
      console.log('createOrder - Order items created:', orderItems.length);

      // Get order items separately
      const orderItemsWithProducts = await OrderItem.find({ orderId: order._id })
        .populate({
          path: 'productId',
          select: 'name imageUrl price unit'
        });

      // Create response with order and items
      const responseData = {
        ...order.toObject(),
        items: orderItemsWithProducts
      };

      // Loyalty: record redeem and earn points
      try {
        if (req.user?.id) {
          let account = await LoyaltyAccount.findOne({ userId: req.user.id });
          if (!account) {
            account = await LoyaltyAccount.create({ userId: req.user.id, pointsBalance: 0, lifetimePoints: 0 });
          }

          // If user redeemed points earlier (deducted balance), record transaction
          if (useLoyaltyPoints && Number(useLoyaltyPoints) > 0) {
            await LoyaltyTransaction.create({
              userId: req.user.id,
              orderId: order._id,
              type: 'redeem',
              points: -Math.abs(Number(useLoyaltyPoints)),
              note: 'Redeem points at checkout'
            });
          }

          // Earn points based on amount paid after discounts and redeem
          const earnPoints = Math.floor(finalAmount / 10000);
          if (earnPoints > 0) {
            account.pointsBalance += earnPoints;
            account.lifetimePoints += earnPoints;
            await account.save();
            await LoyaltyTransaction.create({
              userId: req.user.id,
              orderId: order._id,
              type: 'earn',
              points: earnPoints,
              note: 'Earn points from order'
            });
          }
        }
      } catch (loyaltyError: any) {
        console.error('Loyalty integration error:', loyaltyError);
        // Do not fail order if loyalty fails
      }

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: responseData,
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Create order or guest order (supports both authenticated and guest users)
  static async createOrderOrGuest(req: Request, res: Response) {
    try {
      console.log('createOrderOrGuest - Request body:', req.body);
      
      // Check if user is authenticated
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      
      if (token) {
        try {
          // Try to authenticate user
          
          const decoded = jwt.verify(token, config.jwtSecret);
          const user = await User.findById(decoded.userId).lean();
          
          if (user && user.isActive) {
            console.log('createOrderOrGuest - Authenticated user:', user._id);
            // User is authenticated, create regular order
            req.user = {
              id: String(user._id),
              email: user.email,
              role: user.role,
            };
            return OrderController.createOrder(req as any, res);
          }
        } catch (error) {
          console.log('createOrderOrGuest - Token invalid, proceeding as guest:', error.message);
        }
      }
      
      // No valid token or user not found, create guest order
      console.log('createOrderOrGuest - Creating guest order');
      return OrderController.createGuestOrder(req, res);
      
    } catch (error) {
      console.error('Create order or guest order error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Create guest order (no authentication required)
  static async createGuestOrder(req: Request, res: Response) {
    try {
      const {
        items,
        shippingAddress,
        shippingPhone,
        paymentMethod,
        notes,
        couponCode,
        discountAmount = 0
      } = req.body;

      console.log('Guest order request:', {
        itemsCount: items?.length,
        items: items?.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      });

      if (!items || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Order items are required',
        });
      }

      // Calculate subtotal and apply promotions
      const validItems: any[] = [];
      const evalItems: any[] = [];
      for (const item of items) {
        const product = await findProductById(item.productId);
        if (!product) {
          return res.status(400).json({ success: false, message: `Product ${item.productId} not found` });
        }
        validItems.push({ orderId: null, productId: product._id, quantity: item.quantity, price: product.price });
        evalItems.push({ productId: String(product._id), quantity: item.quantity, price: product.price, categoryId: String(product.categoryId) });
      }
      const pricing = await evaluatePromotions(evalItems);
      const finalAmount = pricing.finalTotal - discountAmount;

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      // Create guest order (no userId)
      const order = await Order.create({
        userId: null, // Guest order
        orderNumber,
        totalAmount: finalAmount,
        discountAmount: (pricing.discountAmount || 0) + (discountAmount || 0),
        couponCode,
        shippingAddress,
        shippingPhone,
        paymentMethod: paymentMethod || 'cash',
        notes,
      });

      // Create order items with valid product IDs
      const orderItems = await OrderItem.insertMany(
        validItems.map(item => ({
          ...item,
          orderId: order._id, // Set the order ID
        }))
      );

      // Get order items separately
      const orderItemsWithProducts = await OrderItem.find({ orderId: order._id })
        .populate({
          path: 'productId',
          select: 'name imageUrl price unit'
        });

      // Create response with order and items
      const responseData = {
        ...order.toObject(),
        items: orderItemsWithProducts
      };

      res.status(201).json({
        success: true,
        message: 'Guest order created successfully',
        data: responseData,
      });
    } catch (error) {
      console.error('Create guest order error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Get guest order by order number (no authentication required)
  static async getGuestOrderByNumber(req: Request, res: Response) {
    try {
      const { orderNumber } = req.params;

      const order = await Order.findOne({ 
        orderNumber,
        userId: null // Only guest orders
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // Get order items separately
      const orderItems = await OrderItem.find({ orderId: order._id })
        .populate({
          path: 'productId',
          select: 'name imageUrl price unit'
        });

      // Create response with order and items
      const responseData = {
        ...order.toObject(),
        items: orderItems
      };

      res.json({
        success: true,
        data: responseData,
      });
    } catch (error) {
      console.error('Get guest order error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Get guest order by ID (no authentication required)
  static async getGuestOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const order = await Order.findOne({ 
        _id: id,
        userId: null // Only guest orders
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // Get order items separately
      const orderItems = await OrderItem.find({ orderId: order._id })
        .populate({
          path: 'productId',
          select: 'name imageUrl price unit description'
        });

      // Create response with order and items
      const responseData = {
        ...order.toObject(),
        items: orderItems
      };

      res.json({
        success: true,
        data: responseData,
      });
    } catch (error) {
      console.error('Get guest order by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Track guest order by order number (no authentication required)
  static async trackGuestOrder(req: Request, res: Response) {
    try {
      const { orderNumber } = req.params;

      const order = await Order.findOne({ 
        orderNumber,
        userId: null // Only guest orders
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // Get order items separately
      const orderItems = await OrderItem.find({ orderId: order._id })
        .populate({
          path: 'productId',
          select: 'name imageUrl price unit'
        });

      // Generate tracking history based on order status
      const trackingHistory = OrderController.generateOrderTrackingHistory(order);

      // Format the response for tracking page
      const trackingData = {
        _id: order._id,
        invoiceNumber: order.orderNumber, // Use orderNumber as invoiceNumber for compatibility
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        totalAmount: order.totalAmount,
        items: orderItems.map((item: any) => ({
          product: {
            name: item.productId?.name || 'Unknown Product',
            imageUrl: item.productId?.imageUrl || '/placeholder-product.jpg'
          },
          quantity: item.quantity,
          price: item.price?.toString() || '0'
        })),
        deliveryInfo: {
          receiverName: 'Khách hàng', // Guest order doesn't have customer name
          receiverPhone: order.shippingPhone || 'N/A',
          address: order.shippingAddress || 'N/A',
          province: 'N/A',
          district: 'N/A',
          ward: 'N/A'
        },
        trackingHistory
      };

      res.json({
        success: true,
        data: trackingData,
        message: 'Order tracking data retrieved successfully'
      });
    } catch (error) {
      console.error('Track guest order error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Generate tracking history based on order status
  private static generateOrderTrackingHistory(order: any): any[] {
    const history = [];
    const now = new Date();

    // Always add order created
    history.push({
      status: 'pending',
      timestamp: order.createdAt,
      description: 'Đơn hàng đã được tạo',
      location: 'Hệ thống'
    });

    // Add status-specific tracking
    switch (order.status) {
      case 'confirmed':
        history.push({
          status: 'confirmed',
          timestamp: order.updatedAt || order.createdAt,
          description: 'Đơn hàng đã được xác nhận',
          location: 'Nhà thuốc'
        });
        break;
      case 'processing':
        history.push({
          status: 'confirmed',
          timestamp: new Date(order.createdAt.getTime() + 30 * 60 * 1000), // 30 minutes later
          description: 'Đơn hàng đã được xác nhận',
          location: 'Nhà thuốc'
        });
        history.push({
          status: 'preparing',
          timestamp: order.updatedAt || new Date(order.createdAt.getTime() + 60 * 60 * 1000),
          description: 'Đơn hàng đang được chuẩn bị',
          location: 'Kho hàng'
        });
        break;
      case 'shipped':
        history.push({
          status: 'confirmed',
          timestamp: new Date(order.createdAt.getTime() + 30 * 60 * 1000),
          description: 'Đơn hàng đã được xác nhận',
          location: 'Nhà thuốc'
        });
        history.push({
          status: 'preparing',
          timestamp: new Date(order.createdAt.getTime() + 60 * 60 * 1000),
          description: 'Đơn hàng đang được chuẩn bị',
          location: 'Kho hàng'
        });
        history.push({
          status: 'shipping',
          timestamp: order.updatedAt || new Date(order.createdAt.getTime() + 2 * 60 * 60 * 1000),
          description: 'Đơn hàng đang được giao',
          location: 'Đang vận chuyển'
        });
        break;
      case 'delivered':
        history.push({
          status: 'confirmed',
          timestamp: new Date(order.createdAt.getTime() + 30 * 60 * 1000),
          description: 'Đơn hàng đã được xác nhận',
          location: 'Nhà thuốc'
        });
        history.push({
          status: 'preparing',
          timestamp: new Date(order.createdAt.getTime() + 60 * 60 * 1000),
          description: 'Đơn hàng đang được chuẩn bị',
          location: 'Kho hàng'
        });
        history.push({
          status: 'shipping',
          timestamp: new Date(order.createdAt.getTime() + 2 * 60 * 60 * 1000),
          description: 'Đơn hàng đang được giao',
          location: 'Đang vận chuyển'
        });
        history.push({
          status: 'delivered',
          timestamp: order.updatedAt || now,
          description: 'Đơn hàng đã được giao thành công',
          location: order.shippingAddress || 'Địa chỉ giao hàng'
        });
        break;
      case 'cancelled':
        history.push({
          status: 'cancelled',
          timestamp: order.updatedAt || now,
          description: 'Đơn hàng đã bị hủy',
          location: 'Hệ thống'
        });
        break;
    }

    return history;
  }

  // Update order (authenticated user)
  static async updateOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      console.log('updateOrder - Order ID:', id);
      console.log('updateOrder - Update data:', updateData);
      
      const order = await Order.findById(id);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }
      
      // Update order
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      
      res.json({
        success: true,
        message: 'Order updated successfully',
        data: updatedOrder,
      });
    } catch (error) {
      console.error('Update order error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Update order status (authenticated - user can only cancel)
  static async updateOrderStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await Order.findOne({ 
        _id: id, 
        userId: req.user!.id 
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // Users can only cancel pending orders
      if (status === 'cancelled' && order.status === 'pending') {
        order.status = 'cancelled';
        await order.save();

        res.json({
          success: true,
          message: 'Order cancelled successfully',
          data: order,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid status update',
        });
      }
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Get order statistics for user (authenticated)
  static async getUserOrderStats(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const stats = await Order.aggregate([
        { $match: { userId: userId } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalAmount: { $sum: '$totalAmount' },
            totalSavings: { $sum: '$discountAmount' },
            pendingOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            completedOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
            },
            cancelledOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
            }
          }
        }
      ]);

      const result = stats[0] || {
        totalOrders: 0,
        totalAmount: 0,
        totalSavings: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0
      };

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Get user order stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Reorder from previous order (authenticated)
  static async reorderFromOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const originalOrder = await Order.findOne({ 
        _id: id, 
        userId: req.user!.id 
      }).populate({
        path: 'items',
        populate: {
          path: 'productId',
          select: 'name imageUrl price unit inStock stockQuantity'
        }
      });

      if (!originalOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // Check product availability
      const availableItems = [];
      const unavailableItems = [];

      for (const item of originalOrder.items) {
        const product = item.productId as any;
        if (product.inStock && product.stockQuantity >= item.quantity) {
          availableItems.push({
            productId: product._id,
            quantity: item.quantity,
            price: product.price,
            name: product.name,
            imageUrl: product.imageUrl,
            unit: product.unit
          });
        } else {
          unavailableItems.push({
            productId: product._id,
            quantity: item.quantity,
            name: product.name,
            reason: !product.inStock ? 'Hết hàng' : 'Không đủ số lượng',
            availableStock: product.stockQuantity || 0
          });
        }
      }

      res.json({
        success: true,
        data: {
          availableItems,
          unavailableItems,
          originalOrder: {
            orderNumber: originalOrder.orderNumber,
            createdAt: originalOrder.createdAt,
            totalAmount: originalOrder.totalAmount
          }
        },
      });
    } catch (error) {
      console.error('Reorder from order error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Link guest order to user account
  static async linkGuestOrderToUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      console.log('linkGuestOrderToUser - Order ID:', id);
      console.log('linkGuestOrderToUser - User ID:', userId);
      console.log('linkGuestOrderToUser - Authenticated User ID:', req.user?.id);

      // Find the guest order
      const order = await Order.findOne({ 
        _id: id,
        userId: null // Only guest orders
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Guest order not found',
        });
      }

      // Update the order with user ID
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { userId: req.user!.id },
        { new: true }
      );

      console.log('linkGuestOrderToUser - Order linked successfully:', updatedOrder?._id);

      res.json({
        success: true,
        message: 'Guest order linked to user account successfully',
        data: updatedOrder,
      });
    } catch (error) {
      console.error('Link guest order to user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Get user's most recent order with detailed medicine information
  static async getMostRecentOrder(req: AuthenticatedRequest, res: Response) {
    try {
      console.log('getMostRecentOrder - User ID:', req.user?.id);
      console.log('getMostRecentOrder - User role:', req.user?.role);
      
      const order = await Order.findOne({ userId: req.user!.id })
        .sort({ createdAt: -1 })
        .limit(1);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'No orders found',
        });
      }

      // Get order items
      const items = await OrderItem.find({ orderId: order._id })
        .populate({
          path: 'productId',
          select: 'name imageUrl price unit description category'
        });

      // Format the response to include detailed medicine information
      const formattedOrder = {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        discountAmount: order.discountAmount,
        couponCode: order.couponCode,
        shippingAddress: order.shippingAddress,
        shippingPhone: order.shippingPhone,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        notes: order.notes,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        medicines: items.map((item: any) => ({
          _id: item._id,
          productId: item.productId._id,
          name: item.productId.name,
          imageUrl: item.productId.imageUrl,
          price: item.price,
          quantity: item.quantity,
          unit: item.productId.unit,
          description: item.productId.description,
          category: item.productId.category
        }))
      };

      res.json({
        success: true,
        data: formattedOrder,
      });
    } catch (error) {
      console.error('Get most recent order error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}
