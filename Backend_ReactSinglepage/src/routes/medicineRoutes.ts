import { Router } from 'express';
import { MedicineController } from '../controllers/medicineController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateId, validatePagination } from '../middleware/validation.js';
import { MedicineSyncService } from '../services/medicineSyncService.js';
import mongoose from 'mongoose';
import { Product } from '../models/schema.js';

const router = Router();

// Public routes
router.get('/', validatePagination, MedicineController.getMedicines);

// Sync endpoint - có thể gọi từ admin project hoặc tự động
router.post('/sync', async (req, res) => {
  try {
    const result = await MedicineSyncService.syncAllMedicines();
    res.json({
      success: true,
      message: 'Medicines synced successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Sync error:', error);
    res.status(500).json({
      success: false,
      message: 'Sync failed',
      error: error.message,
    });
  }
});

// Debug endpoint - kiểm tra medicine imageUrl trong database
router.get('/debug/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const db = mongoose.connection.db;
    
    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Database connection not available',
      });
    }

    const medicinesCollection = db.collection('medicines');
    
    // Tìm trong medicines collection
    const medicine = await medicinesCollection.findOne({
      name: { $regex: name, $options: 'i' }
    });

    // Tìm trong products collection
    const product = await Product.findOne({
      name: { $regex: name, $options: 'i' }
    });

    res.json({
      success: true,
      data: {
        medicine: medicine ? {
          name: medicine.name,
          _id: medicine._id,
          imageUrl: medicine.imageUrl || 'NOT SET',
          image: medicine.image || 'NOT SET',
          imagePath: medicine.imagePath || 'NOT SET',
          allImageFields: {
            imageUrl: medicine.imageUrl,
            image: medicine.image,
            imagePath: medicine.imagePath,
          }
        } : null,
        product: product ? {
          name: product.name,
          _id: product._id,
          imageUrl: product.imageUrl || 'NOT SET',
        } : null,
        match: medicine && product ? {
          imageUrlMatch: (medicine.imageUrl || medicine.image || medicine.imagePath) === product.imageUrl,
          medicineImageUrl: medicine.imageUrl || medicine.image || medicine.imagePath || 'NOT SET',
          productImageUrl: product.imageUrl || 'NOT SET',
        } : null,
      }
    });
  } catch (error: any) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      message: 'Debug failed',
      error: error.message,
    });
  }
});

// Admin routes
router.post('/', authenticateToken, requireAdmin, MedicineController.createMedicine);
router.put('/:id', authenticateToken, requireAdmin, validateId, MedicineController.updateMedicine);
router.delete('/:id', authenticateToken, requireAdmin, validateId, MedicineController.deleteMedicine);

export default router;
