import { Router } from 'express';
import { PrescriptionController } from '../controllers/prescriptionController.js';
import { authenticateToken } from '../middleware/auth.js';
import { processPrescriptionImage } from '../services/ocrService.js';
import { Request, Response } from 'express';

const router = Router();

// All routes require authentication - TEMPORARILY DISABLED FOR TESTING
// router.use(authenticateToken);

// Test OCR endpoint (for debugging)
router.post('/test-ocr', async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'imageUrl is required'
      });
    }

    console.log('🧪 TEST OCR - Starting...');
    const extractedInfo = await processPrescriptionImage(imageUrl);
    
    res.json({
      success: true,
      data: {
        extractedInfo,
        rawText: extractedInfo.rawText.substring(0, 2000) // First 2000 chars for debugging
      }
    });
  } catch (error: any) {
    console.error('❌ TEST OCR Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'OCR test failed',
      error: error.stack
    });
  }
});

// Prescription routes
router.post('/', PrescriptionController.createPrescription);
router.get('/', PrescriptionController.getUserPrescriptions);
router.get('/stats', PrescriptionController.getPrescriptionStats);
router.get('/:id', PrescriptionController.getPrescriptionById);
router.put('/:id/status', PrescriptionController.updatePrescriptionStatus);
router.delete('/:id', PrescriptionController.deletePrescription);

export default router;
