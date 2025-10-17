import { Request, Response } from 'express';
import { Prescription, User, Product } from '../models/schema.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/prescriptions';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload prescription image middleware
export const uploadPrescriptionImage = upload.single('prescriptionImage');

// Create prescription order
export const createPrescriptionOrder = async (req: Request, res: Response) => {
  try {
    const { 
      prescriptionName, 
      hospitalName, 
      doctorName, 
      examinationDate, 
      notes, 
      customerName, 
      phoneNumber 
    } = req.body;

    // Get user ID from auth middleware
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Prescription image is required' 
      });
    }

    // Create prescription record
    const prescription = new Prescription({
      userId,
      doctorName: doctorName || 'Không xác định',
      hospitalName: hospitalName || 'Không xác định',
      prescriptionImage: req.file.path,
      status: 'pending',
      notes: notes || '',
    });

    await prescription.save();

    res.status(201).json({
      success: true,
      message: 'Prescription order created successfully',
      data: {
        prescriptionId: prescription._id,
        status: prescription.status,
        imageUrl: req.file.path
      }
    });

  } catch (error) {
    console.error('Error creating prescription order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Save prescription
export const savePrescription = async (req: Request, res: Response) => {
  try {
    const { 
      prescriptionName, 
      hospitalName, 
      doctorName, 
      examinationDate, 
      notes, 
      customerName, 
      phoneNumber 
    } = req.body;

    // Get user ID from auth middleware
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Prescription image is required' 
      });
    }

    // Create prescription record for saving
    const prescription = new Prescription({
      userId,
      doctorName: doctorName || 'Không xác định',
      hospitalName: hospitalName || 'Không xác định',
      prescriptionImage: req.file.path,
      status: 'saved', // Different status for saved prescriptions
      notes: notes || '',
    });

    await prescription.save();

    res.status(201).json({
      success: true,
      message: 'Prescription saved successfully',
      data: {
        prescriptionId: prescription._id,
        status: prescription.status,
        imageUrl: req.file.path
      }
    });

  } catch (error) {
    console.error('Error saving prescription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Get user's prescriptions
export const getUserPrescriptions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const prescriptions = await Prescription.find({ userId })
      .sort({ createdAt: -1 })
      .select('-prescriptionImage'); // Don't send image data in list

    res.status(200).json({
      success: true,
      data: prescriptions
    });

  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Get prescription by ID
export const getPrescriptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const prescription = await Prescription.findOne({ 
      _id: id, 
      userId 
    });

    if (!prescription) {
      return res.status(404).json({ 
        success: false, 
        message: 'Prescription not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: prescription
    });

  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Update prescription
export const updatePrescription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const updateData = req.body;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const prescription = await Prescription.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true }
    );

    if (!prescription) {
      return res.status(404).json({ 
        success: false, 
        message: 'Prescription not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Prescription updated successfully',
      data: prescription
    });

  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Delete prescription
export const deletePrescription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const prescription = await Prescription.findOneAndDelete({ 
      _id: id, 
      userId 
    });

    if (!prescription) {
      return res.status(404).json({ 
        success: false, 
        message: 'Prescription not found' 
      });
    }

    // Delete the image file
    if (prescription.prescriptionImage && fs.existsSync(prescription.prescriptionImage)) {
      fs.unlinkSync(prescription.prescriptionImage);
    }

    res.status(200).json({
      success: true,
      message: 'Prescription deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting prescription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Get prescription image
export const getPrescriptionImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const prescription = await Prescription.findOne({ 
      _id: id, 
      userId 
    });

    if (!prescription) {
      return res.status(404).json({ 
        success: false, 
        message: 'Prescription not found' 
      });
    }

    if (!prescription.prescriptionImage || !fs.existsSync(prescription.prescriptionImage)) {
      return res.status(404).json({ 
        success: false, 
        message: 'Prescription image not found' 
      });
    }

    res.sendFile(path.resolve(prescription.prescriptionImage));

  } catch (error) {
    console.error('Error fetching prescription image:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Get consultation history
export const getConsultationHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Get consultation requests (prescriptions with status 'pending' or 'approved')
    const consultations = await Prescription.find({ 
      userId,
      status: { $in: ['pending', 'approved'] }
    })
    .sort({ createdAt: -1 })
    .select('-prescriptionImage');

    res.status(200).json({
      success: true,
      data: consultations
    });

  } catch (error) {
    console.error('Error fetching consultation history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// AI-powered prescription analysis
export const analyzePrescription = async (req: Request, res: Response) => {
  try {
    const { prescriptionText, prescriptionImage } = req.body;

    if (!prescriptionText && !prescriptionImage) {
      return res.status(400).json({
        success: false,
        message: 'Prescription text or image is required',
      });
    }

    // Mock AI analysis - in real implementation, integrate with AI service
    const analysisResult = await performAIAnalysis(prescriptionText, prescriptionImage);

    res.json({
      success: true,
      data: analysisResult,
    });
  } catch (error) {
    console.error('Prescription analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Mock AI analysis function
async function performAIAnalysis(prescriptionText?: string, prescriptionImage?: string): Promise<any> {
  // This is a mock implementation
  // In real scenario, integrate with AI service like OpenAI, Google Vision, etc.
  
  const foundMedicines = [];
  const notFoundMedicines = [];
  const analysisNotes = [];
  let totalEstimatedPrice = 0;
  let requiresConsultation = false;
  let confidence = 0.85; // Mock confidence score

  if (prescriptionText) {
    // Simple text analysis
    const lines = prescriptionText.split('\n').map(line => line.trim()).filter(line => line);
    
    for (const line of lines) {
      // Skip non-medicine lines
      if (line.includes('ĐƠN THUỐC') || 
          line.includes('Họ tên') || 
          line.includes('Tuổi') || 
          line.includes('Chẩn đoán') ||
          line.includes('Ngày')) {
        continue;
      }
      
      // Find medicine pattern
      const medicineMatch = line.match(/^\d+\.\s*(.+)/);
      if (medicineMatch) {
        const medicineText = medicineMatch[1];
        
        // Search for medicine in database
        const product = await Product.findOne({
          $or: [
            { name: { $regex: medicineText, $options: 'i' } },
            { description: { $regex: medicineText, $options: 'i' } }
          ]
        });

        if (product) {
          foundMedicines.push({
            productId: product._id,
            productName: product.name,
            price: product.price,
            unit: product.unit,
            inStock: product.inStock,
            stockQuantity: product.stockQuantity,
            requiresPrescription: product.isPrescription,
            confidence: 0.9,
            originalText: medicineText
          });
          totalEstimatedPrice += product.price;
          
          if (product.isPrescription) {
            analysisNotes.push(`⚠️ ${product.name} cần đơn bác sĩ`);
            requiresConsultation = true;
          }
          
          if (product.stockQuantity < 10) {
            analysisNotes.push(`⚠️ ${product.name} sắp hết hàng (còn ${product.stockQuantity} hộp)`);
          }
        } else {
          // Find similar products
          const similarProducts = await Product.find({
            $or: [
              { name: { $regex: medicineText.split(' ')[0], $options: 'i' } },
              { categoryId: { $exists: true } }
            ]
          }).limit(3);

          notFoundMedicines.push({
            originalText: medicineText,
            suggestions: similarProducts.map(p => ({
              productId: p._id,
              productName: p.name,
              price: p.price,
              unit: p.unit
            }))
          });
          
          requiresConsultation = true;
        }
      }
    }
  }

  if (foundMedicines.length === 0) {
    analysisNotes.push("Không tìm thấy thuốc nào trong đơn. Vui lòng liên hệ tư vấn viên.");
    requiresConsultation = true;
    confidence = 0.3;
  } else if (notFoundMedicines.length > 0) {
    analysisNotes.push(`Tìm thấy ${foundMedicines.length} thuốc, ${notFoundMedicines.length} thuốc cần tư vấn thêm`);
    confidence = 0.7;
  } else {
    analysisNotes.push(`✅ Tìm thấy tất cả ${foundMedicines.length} thuốc trong đơn`);
    confidence = 0.95;
  }

  return {
    foundMedicines,
    notFoundMedicines,
    totalEstimatedPrice,
    requiresConsultation,
    analysisNotes,
    confidence,
    analysisTimestamp: new Date(),
    aiModel: 'pharmacy-v1.0' // Mock model name
  };
}
