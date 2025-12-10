import { Request, Response } from 'express';
import { Prescription, User } from '../models/schema.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { config } from '../config/index.js';
import fs from 'fs';
import path from 'path';
import { processPrescriptionImage } from '../services/ocrService.js';
import { SupabaseStorageService } from '../services/supabaseService.js';

export class PrescriptionController {
  // Create new prescription (authenticated) - Now only requires imageUrl, OCR extracts info automatically
  static async createPrescription(req: AuthenticatedRequest, res: Response) {
    try {
      const { imageUrl } = req.body;

      // Validate required fields - only imageUrl is required now
      if (!imageUrl) {
        return res.status(400).json({
          success: false,
          message: 'Prescription image is required',
        });
      }

      // Get userId from auth or use fixed ID for testing
      const userId = req.user?.id || '68e52528b8010bde42a2f589';

      // Generate unique prescription number
      const prescriptionNumber = `PRES-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      console.log('🔍 Starting OCR processing...');
      
      // Process image with OCR to extract information
      let extractedInfo;
      try {
        extractedInfo = await processPrescriptionImage(imageUrl);
        console.log('✅ OCR completed. Extracted info:', {
          customerName: extractedInfo.customerName,
          doctorName: extractedInfo.doctorName,
          hospitalName: extractedInfo.hospitalName,
          examinationDate: extractedInfo.examinationDate,
          dateOfBirth: extractedInfo.dateOfBirth,
          diagnosis: extractedInfo.diagnosis,
        });
      } catch (ocrError: any) {
        console.error('❌ OCR Error:', ocrError.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to process prescription image. Please ensure the image is clear and readable.',
          error: ocrError.message,
        });
      }

      // Process image URL - handle base64 or regular URL
      let processedImageUrl = imageUrl;
      
      // If base64 image, save it to Supabase Storage
      if (imageUrl && imageUrl.startsWith('data:image/')) {
        try {
          const matches = imageUrl.match(/^data:image\/(\w+);base64,(.+)$/);
          if (matches) {
            const mimeType = matches[1];
            const base64Data = matches[2];
            
            // Create safe filename from customer name (if extracted) or timestamp
            const safeName = extractedInfo.customerName 
              ? extractedInfo.customerName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
              : 'unknown';
            const extension = mimeType === 'jpeg' ? 'jpg' : mimeType;
            const timestamp = Date.now();
            const filename = `prescription_${safeName}_${timestamp}.${extension}`;
            const supabasePath = `prescriptions/${filename}`;
            
            try {
              // Upload to Supabase Storage
              const { url } = await SupabaseStorageService.uploadBase64Image(
                'prescriptions_images',
                supabasePath,
                imageUrl
              );
              
              processedImageUrl = url;
              console.log(`📷 Uploaded prescription image to Supabase -> ${url}`);
              // processedImageUrl đã là URL từ Supabase, sẽ được lưu vào database
            } catch (supabaseError: any) {
              console.error(`❌ Error uploading to Supabase:`, supabaseError.message);
              return res.status(500).json({
                success: false,
                message: 'Error uploading image to storage',
              });
            }
          } else {
            console.log(`⚠️ Invalid base64 format for prescription image`);
            return res.status(400).json({
              success: false,
              message: 'Invalid image format',
            });
          }
        } catch (error: any) {
          console.error(`❌ Error saving base64 prescription image:`, error.message);
          return res.status(500).json({
            success: false,
            message: 'Error processing image',
          });
        }
      }

      // Validate extracted information - at least customer name should be extracted
      if (!extractedInfo.customerName) {
        console.warn('⚠️ Some required information could not be extracted from image');
        // Still create prescription but with warning
      }

      // Create prescription with extracted information
      // If information is not found, use "Không có" (Not available) instead of leaving blank
      const prescription = await Prescription.create({
        userId: userId,
        prescriptionNumber: prescriptionNumber,
        customerName: extractedInfo.customerName && extractedInfo.customerName.trim() !== '' && extractedInfo.customerName !== 'NOT FOUND'
          ? extractedInfo.customerName 
          : 'Không có',
        phoneNumber: '', // Phone number field kept for backward compatibility but not extracted
        doctorName: extractedInfo.doctorName && extractedInfo.doctorName.trim() !== '' && extractedInfo.doctorName !== 'NOT FOUND'
          ? extractedInfo.doctorName 
          : 'Không có',
        hospitalName: extractedInfo.hospitalName && extractedInfo.hospitalName.trim() !== '' && extractedInfo.hospitalName !== 'NOT FOUND'
          ? extractedInfo.hospitalName 
          : 'Không có',
        prescriptionImage: processedImageUrl,
        examinationDate: extractedInfo.examinationDate ? new Date(extractedInfo.examinationDate) : undefined,
        dateOfBirth: extractedInfo.dateOfBirth ? new Date(extractedInfo.dateOfBirth) : undefined,
        diagnosis: extractedInfo.diagnosis && extractedInfo.diagnosis !== 'NOT FOUND' && extractedInfo.diagnosis.trim() !== '' 
          ? extractedInfo.diagnosis 
          : 'Không có',
        status: 'pending',
        notes: extractedInfo.notes || '',
      });

      res.status(201).json({
        success: true,
        message: 'Prescription created successfully',
        data: {
          id: prescription._id.toString(),
          prescriptionNumber: prescription.prescriptionNumber || prescriptionNumber,
          customerName: prescription.customerName && prescription.customerName !== 'NOT FOUND' && prescription.customerName.trim() !== ''
            ? prescription.customerName 
            : 'Không có',
          phoneNumber: '', // Phone number no longer extracted
          note: prescription.notes || '',
          imageUrl: prescription.prescriptionImage,
          doctorName: prescription.doctorName && prescription.doctorName !== 'NOT FOUND' && prescription.doctorName.trim() !== ''
            ? prescription.doctorName 
            : 'Không có',
          hospitalName: prescription.hospitalName && prescription.hospitalName !== 'NOT FOUND' && prescription.hospitalName.trim() !== ''
            ? prescription.hospitalName 
            : 'Không có',
          examinationDate: prescription.examinationDate 
            ? prescription.examinationDate.toISOString().split('T')[0]
            : 'Không có',
          dateOfBirth: prescription.dateOfBirth 
            ? prescription.dateOfBirth.toISOString().split('T')[0]
            : 'Không có',
          yearOfBirth: extractedInfo.yearOfBirth || (prescription.dateOfBirth 
            ? prescription.dateOfBirth.getFullYear().toString()
            : undefined),
          age: extractedInfo.age || undefined,
          diagnosis: prescription.diagnosis && prescription.diagnosis !== 'NOT FOUND' && prescription.diagnosis.trim() !== '' 
            ? prescription.diagnosis 
            : 'Không có',
          createdAt: prescription.createdAt.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          status: 'Chờ tư vấn'
        },
      });
    } catch (error) {
      console.error('Create prescription error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Get user's prescriptions - TEMPORARILY USING FIXED USER ID FOR TESTING
  static async getUserPrescriptions(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      // Get userId from auth or use fixed ID for testing
      const userId = (req as any).user?.id || '68e52528b8010bde42a2f589';

      const prescriptions = await Prescription.find({ 
        userId: userId
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Prescription.countDocuments({ 
        userId: userId
      });

      // Transform prescriptions to match frontend format with actual data
      const transformedPrescriptions = prescriptions.map(prescription => {
        // Convert file path to accessible URL if it's a local path
        let imageUrl = prescription.prescriptionImage;
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('blob:')) {
          // If it's a local file path, convert to accessible URL
          if (imageUrl.startsWith('uploads/prescriptions/')) {
            imageUrl = `${config.baseUrl || 'http://localhost:5000'}/${imageUrl}`;
          } else if (imageUrl.startsWith('/')) {
            imageUrl = `${config.baseUrl || 'http://localhost:5000'}${imageUrl}`;
          }
        }

        return {
          id: prescription._id.toString(),
          customerName: prescription.customerName && prescription.customerName !== 'NOT FOUND' && prescription.customerName.trim() !== ''
            ? prescription.customerName 
            : 'Không có',
          phoneNumber: '', // Phone number no longer extracted
          note: prescription.notes || '',
          imageUrl: imageUrl,
          doctorName: prescription.doctorName && prescription.doctorName !== 'NOT FOUND' && prescription.doctorName.trim() !== ''
            ? prescription.doctorName 
            : 'Không có',
          hospitalName: prescription.hospitalName && prescription.hospitalName !== 'NOT FOUND' && prescription.hospitalName.trim() !== ''
            ? prescription.hospitalName 
            : 'Không có',
          examinationDate: prescription.examinationDate 
            ? prescription.examinationDate.toISOString().split('T')[0]
            : 'Không có',
          dateOfBirth: prescription.dateOfBirth 
            ? prescription.dateOfBirth.toISOString().split('T')[0]
            : 'Không có',
          diagnosis: prescription.diagnosis && prescription.diagnosis !== 'NOT FOUND' && prescription.diagnosis.trim() !== '' 
            ? prescription.diagnosis 
            : 'Không có',
          createdAt: prescription.createdAt.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          status: prescription.status === 'pending' ? 'Chờ tư vấn' :
                  prescription.status === 'approved' ? 'Đã tư vấn' :
                  prescription.status === 'rejected' ? 'Đã từ chối' : 'Đã lưu',
          rejectionReason: prescription.rejectionReason || (prescription.status === 'rejected' ? 'Đơn thuốc không hợp lệ' : undefined)
        };
      });

      res.json({
        success: true,
        data: transformedPrescriptions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error('Get user prescriptions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Get prescription by ID (authenticated)
  static async getPrescriptionById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      // Get userId from auth or use fixed ID for testing
      const userId = req.user?.id || '68e52528b8010bde42a2f589';

      const prescription = await Prescription.findOne({ 
        _id: id, 
        userId: userId 
      });

      if (!prescription) {
        return res.status(404).json({
          success: false,
          message: 'Prescription not found',
        });
      }

      // Transform prescription to match frontend format with actual data from database
      // Convert file path to accessible URL if it's a local path
      let imageUrl = prescription.prescriptionImage;
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('blob:')) {
        // If it's a local file path, convert to accessible URL
        const baseUrl = process.env.BASE_URL || `http://localhost:${config.port}`;
        if (imageUrl.startsWith('uploads/prescriptions/')) {
          imageUrl = `${baseUrl}/${imageUrl}`;
        } else if (imageUrl.startsWith('/')) {
          imageUrl = `${baseUrl}${imageUrl}`;
        }
      }

      const transformedPrescription = {
        id: prescription._id.toString(),
        customerName: prescription.customerName && prescription.customerName !== 'NOT FOUND' && prescription.customerName.trim() !== ''
          ? prescription.customerName 
          : 'Không có',
        phoneNumber: '', // Phone number no longer extracted
        note: prescription.notes || '',
        imageUrl: imageUrl,
        doctorName: prescription.doctorName && prescription.doctorName !== 'NOT FOUND' && prescription.doctorName.trim() !== ''
          ? prescription.doctorName 
          : 'Không có',
        hospitalName: prescription.hospitalName && prescription.hospitalName !== 'NOT FOUND' && prescription.hospitalName.trim() !== ''
          ? prescription.hospitalName 
          : 'Không có',
        examinationDate: prescription.examinationDate 
          ? prescription.examinationDate.toISOString().split('T')[0]
          : 'Không có',
        dateOfBirth: prescription.dateOfBirth 
          ? prescription.dateOfBirth.toISOString().split('T')[0]
          : 'Không có',
        diagnosis: prescription.diagnosis && prescription.diagnosis !== 'NOT FOUND' && prescription.diagnosis.trim() !== ''
          ? prescription.diagnosis 
          : 'Không có',
        createdAt: prescription.createdAt.toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: prescription.status === 'pending' ? 'Chờ tư vấn' :
                prescription.status === 'approved' ? 'Đã tư vấn' :
                prescription.status === 'rejected' ? 'Đã từ chối' : 'Đã lưu',
        rejectionReason: prescription.rejectionReason || (prescription.status === 'rejected' ? 'Đơn thuốc không hợp lệ' : undefined)
      };

      res.json({
        success: true,
        data: transformedPrescription,
      });
    } catch (error) {
      console.error('Get prescription by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Update prescription status (authenticated)
  static async updatePrescriptionStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status, rejectionReason } = req.body;

      if (!status || !['pending', 'approved', 'rejected', 'saved'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Valid status is required',
        });
      }

      const prescription = await Prescription.findOne({ 
        _id: id, 
        userId: req.user!.id 
      });

      if (!prescription) {
        return res.status(404).json({
          success: false,
          message: 'Prescription not found',
        });
      }

      const updateData: any = { status };
      if (rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }

      const updatedPrescription = await Prescription.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      res.json({
        success: true,
        message: 'Prescription status updated successfully',
        data: updatedPrescription,
      });
    } catch (error) {
      console.error('Update prescription status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Delete prescription (authenticated)
  static async deletePrescription(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const prescription = await Prescription.findOne({ 
        _id: id, 
        userId: req.user!.id 
      });

      if (!prescription) {
        return res.status(404).json({
          success: false,
          message: 'Prescription not found',
        });
      }

      await Prescription.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Prescription deleted successfully',
      });
    } catch (error) {
      console.error('Delete prescription error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Get prescription statistics (authenticated)
  static async getPrescriptionStats(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const stats = await Prescription.aggregate([
        { $match: { userId: userId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const result = {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        saved: 0
      };

      stats.forEach(stat => {
        result.total += stat.count;
        result[stat._id] = stat.count;
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Get prescription stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}
