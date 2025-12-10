import { Request, Response } from 'express';
import { Product, Category } from '../models/schema.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { MedicineSyncService } from '../services/medicineSyncService.js';

export class MedicineController {
  // Get all medicines (mapped from products)
  static async getMedicines(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        category,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query;

      const offset = (Number(page) - 1) * Number(limit);
      const conditions: any = {};

      // Search by name or description
      if (search) {
        conditions.$text = { $search: String(search) };
      }

      // Filter by category
      if (category) {
        conditions.categoryId = category;
      }

      const sort: Record<string, 1 | -1> = { [String(sortBy)]: sortOrder === 'asc' ? 1 : -1 };

      const products = await Product.find(conditions)
        .populate('categoryId', 'name')
        .sort(sort)
        .skip(offset)
        .limit(Number(limit))
        .lean();

      // Transform products to medicine format
      const medicines = products.map(product => ({
        _id: product._id,
        name: product.name,
        genericName: product.name, // Use name as generic name for now
        manufacturerId: product.brand || '',
        category: product.categoryId?.name || '',
        strength: product.description || '',
        unit: product.unit,
        purchasePrice: Math.round(product.price * 0.7), // Estimate purchase price
        salePrice: product.price,
        stock: product.stockQuantity,
        minStock: 10,
        expiryDate: product.expirationDate,
        createdAt: product.createdAt,
      }));

      const totalCount = await Product.countDocuments(conditions);

      res.json({
        success: true,
        data: medicines,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / Number(limit)),
        },
      });
    } catch (error) {
      console.error('Get medicines error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Create new medicine (maps to product)
  static async createMedicine(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        name,
        genericName,
        manufacturerId,
        category,
        strength,
        unit,
        purchasePrice,
        salePrice,
        stock,
        minStock,
        expiryDate,
      } = req.body;

      // Find or create category
      let categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        categoryDoc = await Category.create({
          name: category,
          icon: 'Pill',
          slug: category.toLowerCase().replace(/\s+/g, '-'),
          description: category,
        });
      }

      // Create product from medicine data
      const productData = {
        name: name,
        description: strength,
        price: salePrice,
        originalPrice: Math.round(salePrice * 1.15), // Add 15% markup
        discountPercentage: 0,
        imageUrl: '/medicine-images/default-medicine.jpg', // Default image
        categoryId: categoryDoc._id,
        brand: manufacturerId,
        unit: unit,
        inStock: stock > 0,
        stockQuantity: stock || 0,
        isHot: false,
        isNewProduct: true, // Mark as new when created
        isPrescription: name.toLowerCase().includes('prescription') || 
                       genericName.toLowerCase().includes('prescription') ||
                       category.toLowerCase().includes('kê đơn'),
        expirationDate: expiryDate ? new Date(expiryDate) : undefined,
      };

      const newProduct = await Product.create(productData);

      // Sync với collection medicines nếu có
      try {
        await MedicineSyncService.syncAllMedicines();
      } catch (syncError) {
        console.error('Sync error after create:', syncError);
        // Không throw error, chỉ log
      }

      // Return medicine format
      const medicine = {
        _id: newProduct._id,
        name: newProduct.name,
        genericName: genericName || newProduct.name,
        manufacturerId: manufacturerId || '',
        category: categoryDoc.name,
        strength: newProduct.description,
        unit: newProduct.unit,
        purchasePrice: purchasePrice || Math.round(newProduct.price * 0.7),
        salePrice: newProduct.price,
        stock: newProduct.stockQuantity,
        minStock: minStock || 10,
        expiryDate: newProduct.expirationDate,
        createdAt: newProduct.createdAt,
      };

      res.status(201).json({
        success: true,
        message: 'Medicine created successfully',
        data: medicine,
      });
    } catch (error) {
      console.error('Create medicine error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Update medicine (maps to product)
  static async updateMedicine(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const {
        name,
        genericName,
        manufacturerId,
        category,
        strength,
        unit,
        purchasePrice,
        salePrice,
        stock,
        minStock,
        expiryDate,
      } = req.body;

      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: 'Medicine not found',
        });
      }

      // Find or create category
      let categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        categoryDoc = await Category.create({
          name: category,
          icon: 'Pill',
          slug: category.toLowerCase().replace(/\s+/g, '-'),
          description: category,
        });
      }

      // Update product
      const updateData = {
        name: name,
        description: strength,
        price: salePrice,
        originalPrice: Math.round(salePrice * 1.15),
        categoryId: categoryDoc._id,
        brand: manufacturerId,
        unit: unit,
        inStock: stock > 0,
        stockQuantity: stock || 0,
        expirationDate: expiryDate ? new Date(expiryDate) : undefined,
      };

      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

      // Sync với collection medicines nếu có
      try {
        await MedicineSyncService.syncAllMedicines();
      } catch (syncError) {
        console.error('Sync error after update:', syncError);
        // Không throw error, chỉ log
      }

      // Return medicine format
      const medicine = {
        _id: updatedProduct!._id,
        name: updatedProduct!.name,
        genericName: genericName || updatedProduct!.name,
        manufacturerId: manufacturerId || '',
        category: categoryDoc.name,
        strength: updatedProduct!.description,
        unit: updatedProduct!.unit,
        purchasePrice: purchasePrice || Math.round(updatedProduct!.price * 0.7),
        salePrice: updatedProduct!.price,
        stock: updatedProduct!.stockQuantity,
        minStock: minStock || 10,
        expiryDate: updatedProduct!.expirationDate,
        createdAt: updatedProduct!.createdAt,
      };

      res.json({
        success: true,
        message: 'Medicine updated successfully',
        data: medicine,
      });
    } catch (error) {
      console.error('Update medicine error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Delete medicine (maps to product)
  static async deleteMedicine(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: 'Medicine not found',
        });
      }

      await Product.findByIdAndDelete(id);

      // Sync với collection medicines nếu có
      try {
        await MedicineSyncService.syncAllMedicines();
      } catch (syncError) {
        console.error('Sync error after delete:', syncError);
        // Không throw error, chỉ log
      }

      res.json({
        success: true,
        message: 'Medicine deleted successfully',
      });
    } catch (error) {
      console.error('Delete medicine error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}
