import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import session from 'express-session';
import path from 'path';

import { config } from './config/index.js';
import { connectDB } from './config/database.js';
import { errorHandler, notFound, generalLimiter, authLimiter, resetRateLimit } from './middleware/errorHandler.js';
import { MedicineSyncService } from './services/medicineSyncService.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import expirationRoutes from './routes/expirationRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import printRoutes from './routes/printRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js';
import loyaltyRoutes from './routes/loyaltyRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import pPointRoutes from './routes/pPointRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import healthSpendingRoutes from './routes/healthSpendingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import supabaseRoutes from './routes/supabaseRoutes.js';

// Initialize AI services on startup
const initializeAIServices = async () => {
  try {
    const aiService = await import('./services/aiService.js');
    // Initialize AI clients (will log status)
    await aiService.initializeAIClients();
  } catch (error) {
    // AI service not available, will use rule-based system
    console.log('ℹ️ AI services will use rule-based fallback');
  }
};

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "http://localhost:3000", "http://localhost:5000", "https://*.supabase.co"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

// Rate limiting
app.use(generalLimiter);

// Compression middleware
app.use(compression());

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files for medicine images with CORS headers
app.use('/medicine-images', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', config.corsOrigin);
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Remove restrictive headers for images
  res.removeHeader('Cross-Origin-Resource-Policy');
  res.removeHeader('Cross-Origin-Opener-Policy');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
}, express.static(path.join(process.cwd(), 'medicine-images')));

// Serve static files for prescription images with CORS headers
app.use('/uploads/prescriptions', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', config.corsOrigin);
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Remove restrictive headers for images
  res.removeHeader('Cross-Origin-Resource-Policy');
  res.removeHeader('Cross-Origin-Opener-Policy');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
}, express.static(path.join(process.cwd(), 'uploads/prescriptions')));

// Session configuration
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.nodeEnv === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// Development helper to reset rate limits
app.get('/reset-rate-limit', resetRateLimit);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv
  });
});

// API routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/recommend', recommendationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/expiration', expirationRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/print', printRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/consultation', consultationRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/promotions', promotionRoutes);
console.log('✅ Promotion routes registered at /api/promotions');
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/p-points', pPointRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/health-spending', healthSpendingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/supabase', supabaseRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start server
const PORT = config.port;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${config.nodeEnv}`);
      console.log(`🌐 CORS Origin: ${config.corsOrigin}`);
      
      // Log VNPay configuration status
      console.log('\n💳 VNPay Configuration Status:');
      console.log(`   VNPAY_TMN_CODE: ${process.env.VNPAY_TMN_CODE ? '✅ Set' : '❌ NOT SET'}`);
      console.log(`   VNPAY_HASH_SECRET: ${process.env.VNPAY_HASH_SECRET ? '✅ Set' : '❌ NOT SET'}`);
      console.log(`   VNPAY_RETURN_URL: ${process.env.VNPAY_RETURN_URL || '❌ NOT SET (will auto-detect)'}`);
      console.log(`   VNPAY_IPN_URL: ${process.env.VNPAY_IPN_URL || '❌ NOT SET (will auto-detect)'}`);
      if (process.env.NODE_ENV === 'production') {
        if (!process.env.VNPAY_RETURN_URL || process.env.VNPAY_RETURN_URL.includes('localhost')) {
          console.log('   ⚠️  WARNING: VNPAY_RETURN_URL not set or using localhost in production!');
          console.log('   ⚠️  Please set VNPAY_RETURN_URL in Render environment variables');
        }
        if (!process.env.VNPAY_IPN_URL || process.env.VNPAY_IPN_URL.includes('localhost')) {
          console.log('   ⚠️  WARNING: VNPAY_IPN_URL not set or using localhost in production!');
          console.log('   ⚠️  Please set VNPAY_IPN_URL in Render environment variables');
        }
      }
      console.log('');
      
      // Start automatic sync job - sync medicines từ collection medicines sang products mỗi 10 giây
      const SYNC_INTERVAL = 10 * 1000; // 10 giây - giảm từ 30 giây để đồng bộ nhanh hơn
      setInterval(async () => {
        try {
          const result = await MedicineSyncService.syncAllMedicines();
          if (result.created > 0 || result.updated > 0 || result.deleted > 0) {
            console.log(`🔄 Auto-sync: ${result.created} created, ${result.updated} updated, ${result.deleted} deleted`);
          }
        } catch (error) {
          console.error('❌ Auto-sync error:', error);
        }
      }, SYNC_INTERVAL);
      
      // Chạy sync ngay lập tức khi server khởi động
      MedicineSyncService.syncAllMedicines()
        .then(result => {
          // Chỉ log khi có thay đổi
          if (result.created > 0 || result.updated > 0 || result.deleted > 0) {
            console.log(`🔄 Initial sync completed: ${result.created} created, ${result.updated} updated, ${result.deleted} deleted`);
          }
        })
        .catch(error => {
          console.error('❌ Initial sync error:', error);
        });
      
      console.log(`🔄 Auto-sync enabled: syncing medicines every ${SYNC_INTERVAL / 1000} seconds`);
      
      // Initialize AI services
      initializeAIServices();
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
