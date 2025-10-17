import { Router } from 'express';
import { 
  createPrescriptionOrder, 
  savePrescription, 
  getUserPrescriptions, 
  getPrescriptionById, 
  updatePrescription, 
  deletePrescription, 
  getPrescriptionImage,
  getConsultationHistory,
  uploadPrescriptionImage,
  analyzePrescription
} from '../controllers/consultationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Create prescription order
router.post('/order', uploadPrescriptionImage, createPrescriptionOrder);

// Save prescription
router.post('/save', uploadPrescriptionImage, savePrescription);

// Get user's prescriptions
router.get('/prescriptions', getUserPrescriptions);

// Get consultation history
router.get('/history', getConsultationHistory);

// Get prescription by ID
router.get('/prescriptions/:id', getPrescriptionById);

// Update prescription
router.put('/prescriptions/:id', updatePrescription);

// Delete prescription
router.delete('/prescriptions/:id', deletePrescription);

// Get prescription image
router.get('/prescriptions/:id/image', getPrescriptionImage);

// AI-powered prescription analysis
router.post('/analyze', analyzePrescription);

export default router;
