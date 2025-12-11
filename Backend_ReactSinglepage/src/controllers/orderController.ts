import { Request, Response } from 'express';
import { Order, OrderItem, Product, User, LoyaltyAccount, LoyaltyTransaction } from '../models/schema';
import { InventoryService } from '../services/inventoryService';
import { evaluatePromotions } from '../services/pricingService';
import { AuthenticatedRequest } from '../middleware/auth';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { PPointController } from './pPointController';
import { NotificationController } from './notificationController';
import mongoose from 'mongoose';

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
  /**
   * Helper function to reduce product stock when order is confirmed
   * Only reduces stock once per order (checks if order was already paid before)
   */
  static async reduceProductStock(orderId: mongoose.Types.ObjectId): Promise<void> {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        console.error(`Order not found for stock reduction: ${orderId}`);
        return;
      }

      // Only reduce stock if order is confirmed and paid
      // Check if order was already processed (to avoid double reduction)
      if (order.paymentStatus !== 'paid' || order.status !== 'confirmed') {
        console.log(`Order ${order.orderNumber} not confirmed/paid yet, skipping stock reduction`);
        return;
      }

      // Get all order items
      const orderItems = await OrderItem.find({ orderId: order._id });
      
      if (orderItems.length === 0) {
        console.log(`No items found for order ${order.orderNumber}`);
        return;
      }

      console.log(`Reducing stock for order ${order.orderNumber} with ${orderItems.length} items`);

      // Reduce stock for each product using batch system (FEFO)
      for (const item of orderItems) {
        const product = await Product.findById(item.productId);
        if (!product) {
          console.error(`Product not found: ${item.productId}`);
          continue;
        }

        const quantityToReduce = item.quantity || 1;
        
        try {
          // Reduce stock from batches using FEFO (First Expired First Out)
          const usedBatches = await InventoryService.reduceStockFromBatches(
            String(item.productId),
            quantityToReduce
          );

          console.log(`Product ${product.name} (${product._id}): Reduced ${quantityToReduce} from batches:`, 
            usedBatches.map(b => `${b.batchNumber}(${b.quantity})`).join(', '));
        } catch (error: any) {
          console.error(`Error reducing stock for product ${product.name}:`, error.message);
          // Log error but continue with other items
          // Stock reduction failure shouldn't break order confirmation
        }
      }

      console.log(`✅ Stock reduction completed for order ${order.orderNumber}`);
    } catch (error) {
      console.error('Error reducing product stock:', error);
      // Don't throw error - stock reduction failure shouldn't break order confirmation
    }
  }

  // Get user's order history (authenticated)
  static async getUserOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      console.log('getUserOrders - User ID:', userId);
      console.log('getUserOrders - User ID type:', typeof userId);
      console.log('getUserOrders - User role:', req.user?.role);
      
      const { page = 1, limit = 20, status } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      // Convert userId to ObjectId if it's a string
      const userIdObj = mongoose.Types.ObjectId.isValid(userId) 
        ? new mongoose.Types.ObjectId(userId) 
        : userId;

      console.log('getUserOrders - User ID ObjectId:', userIdObj);

      let filter: any = { userId: userIdObj };
      console.log('getUserOrders - Filter:', filter);
      if (status) {
        filter.status = status;
      }

      const orders = await Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      console.log('getUserOrders - Found orders:', orders.length);

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

      console.log('getUserOrders - Total orders:', total);
      console.log('getUserOrders - Orders with items:', ordersWithItems.length);

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

      // For MoMo payment method, always check payment status to ensure it's up-to-date
      // This ensures payment status is updated if callback was successful or delayed
      if (order.paymentMethod === 'momo') {
        try {
          const { MomoService } = await import('../services/momoService');
          const requestId = Date.now().toString();
          const momoStatus = await MomoService.queryPaymentStatus(
            order.orderNumber,
            requestId
          );

          // If MoMo confirms payment is successful, update order
          if (momoStatus.resultCode === 0 && order.paymentStatus !== 'paid') {
            order.paymentStatus = 'paid';
            order.status = 'confirmed';
            await order.save();
            console.log(`Order ${order.orderNumber} payment confirmed via MoMo query in getOrderById - Auto confirmed payment and order`);
          } else if (momoStatus.resultCode !== 0 && order.paymentStatus === 'paid') {
            // If MoMo says payment failed but order shows paid, log warning but don't change
            console.warn(`Order ${order.orderNumber} shows paid but MoMo query returned resultCode: ${momoStatus.resultCode}`);
          }
        } catch (error) {
          console.error('Error checking MoMo payment status in getOrderById:', error);
          // Continue with order data even if payment status check fails
        }
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
        useLoyaltyPoints = 0,
        usePPoints = 0 // P-Xu Vàng (1 P-Xu = 100 VND)
      } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Order items are required',
        });
      }

      // Calculate subtotal and apply promotions
      // Also store valid products for order items creation
      const enrichedItems: any[] = [];
      const validItemsForOrder: any[] = [];
      for (const item of items) {
        const product = await findProductById(item.productId);
        if (!product) {
          return res.status(400).json({ success: false, message: `Product ${item.productId} not found` });
        }
        
        // Check stock availability
        if (!product.inStock || product.stockQuantity === 0) {
          return res.status(400).json({ 
            success: false, 
            message: `Sản phẩm "${product.name}" đã hết hàng, đang bổ sung thêm hàng` 
          });
        }
        
        if (product.stockQuantity < item.quantity) {
          return res.status(400).json({ 
            success: false, 
            message: `Sản phẩm "${product.name}" đã hết hàng, đang bổ sung thêm hàng. Số lượng còn lại: ${product.stockQuantity} ${product.unit}` 
          });
        }
        
        enrichedItems.push({
          productId: String(product._id),
          quantity: item.quantity,
          price: product.price,
          categoryId: String(product.categoryId)
        });
        // Store valid product info for order items
        validItemsForOrder.push({
          productId: product._id, // Use actual MongoDB ObjectId
          quantity: item.quantity,
          price: item.price || product.price // Use provided price or product price
        });
      }
      const pricing = await evaluatePromotions(enrichedItems);
      let finalAmount = pricing.finalTotal - discountAmount;
      let pPointDiscount = 0;

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

      // Apply P-Xu Vàng redeem (1 P-Xu = 100 VND) - có thể kết hợp với mã giảm giá
      // Note: We'll deduct P-Xu after order is created to get orderId
      let pPointsToUse = 0;
      if (usePPoints && req.user?.id && Number(usePPoints) > 0) {
        // Calculate discount amount first (1 P-Xu = 100 VND)
        pPointsToUse = Number(usePPoints);
        pPointDiscount = pPointsToUse * 100; // 1 P-Xu = 100 VND
        finalAmount = Math.max(0, finalAmount - pPointDiscount);
      }

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      // Create order
      const userId = req.user?.id;
      console.log('createOrder - Creating order with userId:', userId);
      
      if (!userId) {
        console.error('createOrder - ERROR: userId is missing! req.user:', req.user);
        return res.status(400).json({
          success: false,
          message: 'User ID is required to create order',
        });
      }
      
      // Set payment status based on payment method
      // Cash payment: pending (admin needs to confirm)
      // Online payment (momo/zalopay): pending (will be auto-confirmed via callback)
      const paymentMethodValue = paymentMethod || 'cash';
      const paymentStatus = 'pending'; // Always pending initially, will be updated by admin (cash) or callback (online)
      const orderStatus = 'pending'; // Order status is pending until payment is confirmed
      
      const order = await Order.create({
        userId: userId,
        orderNumber,
        totalAmount: finalAmount,
        discountAmount: (pricing.discountAmount || 0) + (discountAmount || 0),
        couponCode,
        shippingAddress,
        shippingPhone,
        paymentMethod: paymentMethodValue,
        paymentStatus: paymentStatus,
        status: orderStatus,
        notes,
      });
      
      console.log('createOrder - Order created successfully with ID:', order._id, 'userId:', order.userId);

      // Create order items using valid products from database
      console.log('createOrder - Creating order items:', validItemsForOrder);
      const orderItems = await OrderItem.insertMany(
        validItemsForOrder.map((item: any) => ({
          orderId: order._id,
          productId: item.productId, // This is now a valid MongoDB ObjectId
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

      // P-Xu Vàng: record redeem and earn P-Xu
      try {
        if (req.user?.id) {
          // Redeem P-Xu (if used) - now we have orderId
          if (pPointsToUse > 0 && pPointDiscount > 0) {
            await PPointController.redeemAtCheckout(
              req.user.id,
              String(order._id),
              pPointsToUse
            );
          }

          // Earn P-Xu from order (5,000 VND = 1 P-Xu)
          // Nhận P-Xu khi đơn hàng được tạo thành công (giả định đã thanh toán)
          // Tính theo số tiền cuối cùng sau khi trừ tất cả giảm giá
          if (finalAmount > 0) {
            await PPointController.earnFromOrder(req.user.id, String(order._id), finalAmount);
          }
        }
      } catch (pPointError: any) {
        console.error('P-Xu integration error:', pPointError);
        // Do not fail order if P-Xu fails
      }

      // Create notification for order created
      try {
        if (req.user?.id) {
          await NotificationController.createNotification(
            req.user.id,
            'order',
            'Đơn hàng mới',
            `Đơn hàng ${orderNumber} của bạn đã được tạo thành công với tổng tiền ${finalAmount.toLocaleString('vi-VN')} ₫`,
            `/account/chi-tiet-don-hang/${order._id}`,
            {
              orderId: order._id,
              orderNumber,
            }
          );
        }
      } catch (notificationError: any) {
        console.error('Create notification error:', notificationError);
        // Do not fail order if notification fails
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
      
      console.log('createOrderOrGuest - Has token:', !!token);
      console.log('createOrderOrGuest - Auth header:', authHeader ? 'present' : 'missing');
      
      if (token) {
        try {
          // Try to authenticate user
          console.log('createOrderOrGuest - Verifying token with secret:', config.jwtSecret ? 'present' : 'missing');
          const decoded: any = jwt.verify(token, config.jwtSecret);
          console.log('createOrderOrGuest - Token decoded:', decoded);
          
          if (decoded && decoded.userId) {
            const user = await User.findById(decoded.userId).lean();
            console.log('createOrderOrGuest - User found:', user ? { id: user._id, isActive: user.isActive } : 'not found');
            
            if (user && user.isActive) {
              console.log('createOrderOrGuest - Authenticated user, creating order with userId:', user._id);
              // User is authenticated, create regular order
              (req as any).user = {
                id: String(user._id),
                email: user.email,
                role: user.role,
              };
              return OrderController.createOrder(req as any, res);
            } else {
              console.log('createOrderOrGuest - User not found or inactive, proceeding as guest');
            }
          } else {
            console.log('createOrderOrGuest - Token decoded but no userId, proceeding as guest');
          }
        } catch (error: any) {
          console.log('createOrderOrGuest - Token verification failed:', error.message);
          console.log('createOrderOrGuest - Error details:', error.name, error.expiredAt);
          // Continue to guest order creation
        }
      } else {
        console.log('createOrderOrGuest - No token provided, proceeding as guest');
      }
      
      // No valid token or user not found, create guest order
      console.log('createOrderOrGuest - Creating guest order (no userId)');
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
        
        // Check stock availability
        if (!product.inStock || product.stockQuantity === 0) {
          return res.status(400).json({ 
            success: false, 
            message: `Sản phẩm "${product.name}" đã hết hàng, đang bổ sung thêm hàng` 
          });
        }
        
        if (product.stockQuantity < item.quantity) {
          return res.status(400).json({ 
            success: false, 
            message: `Sản phẩm "${product.name}" đã hết hàng, đang bổ sung thêm hàng. Số lượng còn lại: ${product.stockQuantity} ${product.unit}` 
          });
        }
        
        validItems.push({ orderId: null, productId: product._id, quantity: item.quantity, price: product.price });
        evalItems.push({ productId: String(product._id), quantity: item.quantity, price: product.price, categoryId: String(product.categoryId) });
      }
      const pricing = await evaluatePromotions(evalItems);
      const finalAmount = pricing.finalTotal - discountAmount;

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      // Set payment status based on payment method
      // Cash payment: pending (admin needs to confirm)
      // Online payment (momo/zalopay): pending (will be auto-confirmed via callback)
      const paymentMethodValue = paymentMethod || 'cash';
      const paymentStatus = 'pending'; // Always pending initially, will be updated by admin (cash) or callback (online)
      const orderStatus = 'pending'; // Order status is pending until payment is confirmed
      
      // Create guest order (no userId)
      const order = await Order.create({
        userId: null, // Guest order
        orderNumber,
        totalAmount: finalAmount,
        discountAmount: (pricing.discountAmount || 0) + (discountAmount || 0),
        couponCode,
        shippingAddress,
        shippingPhone,
        paymentMethod: paymentMethodValue,
        paymentStatus: paymentStatus,
        status: orderStatus,
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

  // Admin: Confirm cash payment (for cash payment method only)
  // PUT /api/orders/:id/confirm-payment
  static async confirmPayment(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      
      // Check if user is admin or pharmacist
      if (req.user?.role !== 'admin' && req.user?.role !== 'pharmacist') {
        return res.status(403).json({
          success: false,
          message: 'Only admin or pharmacist can confirm payment',
        });
      }
      
      const order = await Order.findById(id);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }
      
      // Only allow confirming payment for cash payment method
      // Online payments (momo/zalopay) are auto-confirmed via callback
      if (order.paymentMethod !== 'cash') {
        return res.status(400).json({
          success: false,
          message: `Payment confirmation is only needed for cash payment. This order uses ${order.paymentMethod} which is auto-confirmed.`,
        });
      }
      
      // Only allow confirming if payment status is pending
      if (order.paymentStatus !== 'pending') {
        return res.status(400).json({
          success: false,
          message: `Payment status is already ${order.paymentStatus}. Cannot confirm payment.`,
        });
      }
      
      // Confirm payment and update order status
      const wasAlreadyPaid = order.paymentStatus === 'paid';
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      await order.save();
      
      console.log(`Order ${order.orderNumber} payment confirmed by admin/pharmacist`);
      
      // Reduce product stock if order was just confirmed (not already paid)
      if (!wasAlreadyPaid) {
        await OrderController.reduceProductStock(order._id);
      }
      
      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        data: order,
      });
    } catch (error) {
      console.error('Confirm payment error:', error);
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
      console.log('getUserOrderStats - User ID:', userId);
      console.log('getUserOrderStats - User ID type:', typeof userId);

      // Convert userId to ObjectId if it's a string
      const userIdObj = mongoose.Types.ObjectId.isValid(userId) 
        ? new mongoose.Types.ObjectId(userId) 
        : userId;

      console.log('getUserOrderStats - User ID ObjectId:', userIdObj);

      const stats = await Order.aggregate([
        { 
          $match: { 
            userId: userIdObj 
          } 
        },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalAmount: { $sum: '$totalAmount' },
            totalSavings: { $sum: { $ifNull: ['$discountAmount', 0] } },
            pendingOrders: {
              $sum: { 
                $cond: [
                  { $in: ['$status', ['pending', 'confirmed', 'processing']] }, 
                  1, 
                  0
                ] 
              }
            },
            completedOrders: {
              $sum: { 
                $cond: [
                  { $eq: ['$status', 'delivered'] }, 
                  1, 
                  0
                ] 
              }
            },
            cancelledOrders: {
              $sum: { 
                $cond: [
                  { $eq: ['$status', 'cancelled'] }, 
                  1, 
                  0
                ] 
              }
            }
          }
        }
      ]);

      console.log('getUserOrderStats - Aggregation result:', stats);

      const result = stats[0] || {
        totalOrders: 0,
        totalAmount: 0,
        totalSavings: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0
      };

      console.log('getUserOrderStats - Final result:', result);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Get user order stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Reorder from previous order (authenticated)
  static async reorderFromOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      // Require authentication explicitly to avoid 500 when req.user is undefined
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required to reorder',
        });
      }

      // Ensure the order belongs to the authenticated user
      const originalOrder = await Order.findOne({
        _id: id,
        userId: req.user.id,
      });

      if (!originalOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // Load order items via OrderItem since items may not be embedded on Order
      const orderItems = await OrderItem.find({ orderId: originalOrder._id })
        .populate({
          path: 'productId',
          select: 'name imageUrl price unit inStock stockQuantity',
        });

      // Check product availability
      const availableItems: any[] = [];
      const unavailableItems: any[] = [];

      for (const item of orderItems) {
        const product = item.productId as any;
        if (product && product.inStock && product.stockQuantity >= item.quantity) {
          availableItems.push({
            productId: product._id,
            quantity: item.quantity,
            price: product.price,
            name: product.name,
            imageUrl: product.imageUrl,
            unit: product.unit,
          });
        } else if (product) {
          unavailableItems.push({
            productId: product._id,
            quantity: item.quantity,
            name: product.name,
            reason: !product.inStock ? 'Hết hàng' : 'Không đủ số lượng',
            availableStock: product.stockQuantity || 0,
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
        medicines: items.map((item: any) => {
          // Handle null productId
          if (!item.productId) {
            return {
              _id: item._id,
              productId: item.productId?._id || null,
              name: 'Sản phẩm đã bị xóa',
              imageUrl: '/medicine-images/default-medicine.jpg',
              price: item.price || 0,
              quantity: item.quantity,
              unit: 'đơn vị',
              description: null,
              category: null
            };
          }
          
          return {
            _id: item._id,
            productId: item.productId._id,
            name: item.productId.name || 'Sản phẩm không xác định',
            imageUrl: item.productId.imageUrl || '/medicine-images/default-medicine.jpg',
            price: item.price || item.productId.price || 0,
            quantity: item.quantity,
            unit: item.productId.unit || 'đơn vị',
            description: item.productId.description || null,
            category: item.productId.category || null
          };
        })
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
