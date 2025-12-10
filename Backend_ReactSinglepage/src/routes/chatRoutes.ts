import { Router } from 'express';
import { chatWithAI } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Chat endpoint - optional authentication (guests can also chat)
router.post('/', chatWithAI);

export default router;

