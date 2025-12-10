import { Router } from 'express';
import { PromotionController } from '../controllers/promotionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Debug middleware to log all requests
router.use((req, res, next) => {
  if (req.path.includes('validate-code')) {
    console.log('🔍 Promotion route hit:', req.method, req.path, req.body);
  }
  next();
});

// Public routes - must be defined before parameterized routes
router.get('/', PromotionController.getAllPromotions);
router.get('/active', PromotionController.getActivePromotions);
router.post('/apply', PromotionController.applyToCart);
router.post('/validate-code', PromotionController.validateCode);

// Parameterized routes - must be last
router.get('/:id', PromotionController.getPromotionById);

// Admin (optionally protect later with admin middleware)
router.use(authenticateToken);
router.post('/', PromotionController.createPromotion);
router.put('/:id', PromotionController.updatePromotion);
router.delete('/:id', PromotionController.deletePromotion);

export default router;


