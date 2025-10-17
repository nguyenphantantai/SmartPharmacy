import { Router } from 'express';
import { MedicineController } from '../controllers/medicineController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateId, validatePagination } from '../middleware/validation.js';

const router = Router();

// Public routes
router.get('/', validatePagination, MedicineController.getMedicines);

// Admin routes
router.post('/', authenticateToken, requireAdmin, MedicineController.createMedicine);
router.put('/:id', authenticateToken, requireAdmin, validateId, MedicineController.updateMedicine);
router.delete('/:id', authenticateToken, requireAdmin, validateId, MedicineController.deleteMedicine);

export default router;
