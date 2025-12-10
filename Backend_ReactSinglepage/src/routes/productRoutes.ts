import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateProduct, validateId, validatePagination } from '../middleware/validation.js';
import { trackSearchHistory, trackViewHistory } from '../middleware/trackingMiddleware.js';

const router = Router();

// Public routes
router.get('/', validatePagination, trackSearchHistory, ProductController.getProducts);
router.get('/hot', ProductController.getHotProducts);
router.get('/new', ProductController.getNewProducts);
router.get('/brands', ProductController.getBrands);
router.get('/:id', validateId, trackViewHistory, ProductController.getProductById);

// Admin routes
router.post('/', authenticateToken, requireAdmin, validateProduct, ProductController.createProduct);
router.put('/:id', authenticateToken, requireAdmin, validateId, ProductController.updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, validateId, ProductController.deleteProduct);

export default router;




