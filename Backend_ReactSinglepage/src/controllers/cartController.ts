import { Request, Response } from 'express';
import { Cart, Product } from '../models/schema.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class CartController {
  // Get user's cart
  static async getCart(req: AuthenticatedRequest, res: Response) {
    try {
      const cartItems = await Cart.find({ userId: req.user!.id })
        .populate('productId')
        .lean();

      res.json({
        success: true,
        data: cartItems,
      });
    } catch (error) {
      console.error('Get cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Add item to cart
  static async addToCart(req: AuthenticatedRequest, res: Response) {
    try {
      const { productId, quantity = 1 } = req.body;

      // Check if product exists and is in stock
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      if (!product.inStock || product.stockQuantity < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Product is out of stock',
        });
      }

      // Check if item already exists in cart
      const existingItem = await Cart.findOne({ userId: req.user!.id, productId });

      if (existingItem) {
        // Update quantity
        existingItem.quantity = existingItem.quantity + quantity;
        await existingItem.save();

        return res.json({
          success: true,
          message: 'Cart updated successfully',
          data: existingItem,
        });
      } else {
        // Add new item
        const newItem = await Cart.create({
          userId: req.user!.id,
          productId,
          quantity,
        });

        return res.status(201).json({
          success: true,
          message: 'Item added to cart successfully',
          data: newItem,
        });
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Update cart item quantity
  static async updateCartItem(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be greater than 0',
        });
      }

      // Check if cart item exists and belongs to user
      const existingItem = await Cart.findOne({ _id: id, userId: req.user!.id });

      if (!existingItem) {
        return res.status(404).json({
          success: false,
          message: 'Cart item not found',
        });
      }

      // Check product stock
      const product = await Product.findById(existingItem.productId);

      if (!product || product.stockQuantity < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock',
        });
      }
      existingItem.quantity = quantity;
      await existingItem.save();

      res.json({
        success: true,
        message: 'Cart item updated successfully',
        data: existingItem,
      });
    } catch (error) {
      console.error('Update cart item error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Remove item from cart
  static async removeFromCart(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      // Check if cart item exists and belongs to user
      const existingItem = await Cart.findOne({ _id: id, userId: req.user!.id });

      if (!existingItem) {
        return res.status(404).json({
          success: false,
          message: 'Cart item not found',
        });
      }
      await Cart.deleteOne({ _id: id });

      res.json({
        success: true,
        message: 'Item removed from cart successfully',
      });
    } catch (error) {
      console.error('Remove from cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Clear entire cart
  static async clearCart(req: AuthenticatedRequest, res: Response) {
    try {
      await Cart.deleteMany({ userId: req.user!.id });

      res.json({
        success: true,
        message: 'Cart cleared successfully',
      });
    } catch (error) {
      console.error('Clear cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}

