import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { MomoService, MomoCallbackData } from '../services/momoService';
import { VnpayService, VnpayCallbackData } from '../services/vnpayService';
import { Order } from '../models/schema';
import { config } from '../config/index';

export class PaymentController {
  /**
   * Get base URL from request (supports production with reverse proxy)
   * This automatically detects the correct URL when deployed
   */
  private static getBaseUrl(req: Request, isBackend: boolean = false): string {
    try {
      // Priority 1: Use environment variable if set (ALWAYS prefer env vars in production)
      if (isBackend) {
        const envIpnUrl = process.env.VNPAY_IPN_URL;
        if (envIpnUrl) {
          console.log('✅ Using VNPAY_IPN_URL from environment:', envIpnUrl);
          return envIpnUrl;
        }
      } else {
        const envReturnUrl = process.env.VNPAY_RETURN_URL;
        if (envReturnUrl) {
          console.log('✅ Using VNPAY_RETURN_URL from environment:', envReturnUrl);
          return envReturnUrl;
        }
      }

      // Priority 2: Build from request headers (works with reverse proxy)
      // This is fallback for development or when env vars not set
      let protocol = 'https'; // Default to https for production
      
      // Check x-forwarded-proto first (from reverse proxy)
      if (req.headers['x-forwarded-proto']) {
        protocol = String(req.headers['x-forwarded-proto']).split(',')[0].trim();
      } else {
        // Check if request is secure (Express may not have req.secure in all cases)
        const isSecure = (req as any).secure || 
                        req.headers['x-forwarded-ssl'] === 'on' ||
                        (req.headers['x-forwarded-proto'] as string)?.includes('https');
        protocol = isSecure ? 'https' : 'http';
      }

      // Get host from headers
      let host = 'localhost:5000'; // Default fallback
      if (req.headers['x-forwarded-host']) {
        host = String(req.headers['x-forwarded-host']).split(',')[0].trim();
      } else if (req.headers.host) {
        host = String(req.headers.host);
      }
      
      // Remove port from host if it's standard (80 for http, 443 for https)
      let cleanHost = host;
      if ((protocol === 'http' && cleanHost.endsWith(':80')) ||
          (protocol === 'https' && cleanHost.endsWith(':443'))) {
        cleanHost = cleanHost.split(':')[0];
      }

      const baseUrl = `${protocol}://${cleanHost}`;

      if (isBackend) {
        // For IPN URL (backend callback)
        const ipnUrl = `${baseUrl}/api/payment/vnpay/callback`;
        console.log('⚠️ Auto-detected IPN URL (consider setting VNPAY_IPN_URL):', ipnUrl);
        return ipnUrl;
      } else {
        // For return URL (frontend redirect)
        // Try to get frontend URL from CORS origin first
        try {
          if (config && config.corsOrigin && !config.corsOrigin.includes('localhost')) {
            const returnUrl = `${config.corsOrigin}/payment-success`;
            console.log('✅ Using frontend URL from CORS_ORIGIN:', returnUrl);
            return returnUrl;
          }
        } catch (configError) {
          console.warn('Could not access config.corsOrigin:', configError);
        }
        
        // Fallback: construct from backend URL (remove port or replace)
        let frontendUrl = baseUrl;
        // Remove port number if present
        frontendUrl = frontendUrl.replace(/:\d+$/, '');
        // If still has port 5000, try to replace with common frontend patterns
        if (frontendUrl.includes(':5000')) {
          frontendUrl = frontendUrl.replace(':5000', '');
        }
        
        const returnUrl = `${frontendUrl}/payment-success`;
        console.log('⚠️ Auto-detected Return URL (consider setting VNPAY_RETURN_URL):', returnUrl);
        return returnUrl;
      }
    } catch (error: any) {
      console.error('Error in getBaseUrl:', error);
      // Fallback to environment variables or defaults
      if (isBackend) {
        return process.env.VNPAY_IPN_URL || 'http://localhost:5000/api/payment/vnpay/callback';
      } else {
        return process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment-success';
      }
    }
  }
  /**
   * Create MoMo payment request
   * POST /api/payment/momo/create
   */
  static async createMomoPayment(req: Request, res: Response) {
    try {
      const { orderId, amount, orderInfo } = req.body;

      if (!orderId || !amount) {
        return res.status(400).json({
          success: false,
          message: 'Order ID and amount are required',
        });
      }

      // Verify order exists
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // If user is authenticated, verify order belongs to them
      const authReq = req as AuthenticatedRequest;
      if (authReq.user?.id && order.userId && order.userId.toString() !== authReq.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized access to this order',
        });
      }

      // Verify order amount matches
      if (order.totalAmount !== amount) {
        return res.status(400).json({
          success: false,
          message: 'Amount mismatch',
        });
      }

      // Verify payment method is momo
      if (order.paymentMethod !== 'momo') {
        return res.status(400).json({
          success: false,
          message: 'Order payment method is not MoMo',
        });
      }

      console.log('Creating MoMo payment request:', {
        orderId: order.orderNumber,
        amount: amount,
        orderInfo: orderInfo || `Thanh toán đơn hàng ${order.orderNumber}`,
      });

      // Create MoMo payment request
      const momoResponse = await MomoService.createPaymentRequest({
        orderId: order.orderNumber,
        orderInfo: orderInfo || `Thanh toán đơn hàng ${order.orderNumber}`,
        amount: amount,
        extraData: orderId, // Store order ID in extraData for callback
      });

      // Extract MoMo orderId from response (it's the same as requestId)
      // MoMo orderId format: MOMO + timestamp (e.g., MOMO1762532509396)
      const momoOrderId = momoResponse.orderId || momoResponse.requestId;
      
      // Save MoMo orderId to order for later payment status queries
      if (momoOrderId) {
        order.momoOrderId = momoOrderId;
        await order.save();
        console.log(`Saved MoMo orderId ${momoOrderId} to order ${order.orderNumber}`);
      }

      console.log('MoMo payment response received:', {
        resultCode: momoResponse.resultCode,
        message: momoResponse.message,
        hasPayUrl: !!momoResponse.payUrl,
        hasQrCodeUrl: !!momoResponse.qrCodeUrl,
        hasDeeplink: !!momoResponse.deeplink,
        momoOrderId: momoOrderId,
      });

      res.json({
        success: true,
        data: {
          payUrl: momoResponse.payUrl,
          qrCodeUrl: momoResponse.qrCodeUrl,
          deeplink: momoResponse.deeplink,
          orderId: order.orderNumber,
        },
      });
    } catch (error: any) {
      console.error('Create MoMo payment error:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create MoMo payment',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  }

  /**
   * Handle MoMo callback (IPN)
   * POST /api/payment/momo/callback
   */
  static async handleMomoCallback(req: Request, res: Response) {
    try {
      const callbackData: MomoCallbackData = req.body;

      console.log('MoMo callback received:', callbackData);

      // Verify signature
      const isValid = MomoService.verifySignature(callbackData);
      if (!isValid) {
        console.error('Invalid MoMo callback signature');
        return res.status(400).json({
          success: false,
          message: 'Invalid signature',
        });
      }

      // Find order by extraData (contains database orderId)
      // MoMo orderId is different from database orderNumber
      // We store database orderId in extraData when creating payment request
      let order;
      
      if (callbackData.extraData) {
        // Try to find order by extraData (database orderId)
        order = await Order.findById(callbackData.extraData);
      }
      
      // Fallback: try to find by orderNumber if extraData not found
      if (!order) {
        order = await Order.findOne({
          orderNumber: callbackData.orderId,
        });
      }

      if (!order) {
        console.error('Order not found for MoMo callback:', {
          momoOrderId: callbackData.orderId,
          extraData: callbackData.extraData,
        });
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // Update order payment status based on resultCode
      // resultCode = 0: Success - Auto confirm payment and order for online payments
      // resultCode != 0: Failed
      if (callbackData.resultCode === 0) {
        // For online payments (momo/zalopay), auto-confirm payment and order
        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        await order.save();

        console.log(`Order ${order.orderNumber} payment confirmed via MoMo - Auto confirmed payment and order`);
      } else {
        order.paymentStatus = 'failed';
        await order.save();

        console.log(
          `Order ${order.orderNumber} payment failed via MoMo: ${callbackData.message}`
        );
      }

      // Return success to MoMo
      res.status(200).json({
        success: true,
        message: 'Callback processed successfully',
      });
    } catch (error: any) {
      console.error('MoMo callback error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process callback',
      });
    }
  }

  /**
   * Query payment status
   * GET /api/payment/momo/status/:orderId
   */
  static async getPaymentStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { resultCode } = req.query; // Get resultCode from query params if available

      // Try to find order by orderNumber first
      let order = await Order.findOne({ orderNumber: orderId });
      
      // If not found and orderId looks like MoMo orderId (starts with "MOMO"), try to find by momoOrderId
      if (!order && orderId.startsWith('MOMO')) {
        order = await Order.findOne({ momoOrderId: orderId });
        console.log(`Order not found by orderNumber, trying momoOrderId: ${orderId}`, order ? 'Found' : 'Not found');
      }
      
      // If still not found and orderId looks like MoMo orderId, try to query MoMo API to get extraData
      if (!order && orderId.startsWith('MOMO')) {
        try {
          const requestId = Date.now().toString();
          const momoStatus = await MomoService.queryPaymentStatus(orderId, requestId);
          
          // If MoMo returns extraData (database orderId), try to find order by it
          if (momoStatus.extraData) {
            order = await Order.findById(momoStatus.extraData);
            console.log(`Order found via MoMo extraData: ${momoStatus.extraData}`, order ? 'Found' : 'Not found');
          }
        } catch (queryError) {
          console.error('Error querying MoMo for extraData:', queryError);
          // Continue with 404 response below
        }
      }
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // If resultCode is provided and is 0, confirm payment immediately
      // This handles the case when user is redirected from MoMo with resultCode=0
      if (resultCode === '0' || resultCode === 0) {
        if (order.paymentStatus !== 'paid') {
          order.paymentStatus = 'paid';
          order.status = 'confirmed';
          await order.save();
          console.log(`Order ${order.orderNumber} payment confirmed via resultCode=0 - Auto confirmed payment and order`);
        }
        return res.json({
          success: true,
          data: {
            orderId: order.orderNumber,
            orderDbId: order._id.toString(),
            paymentStatus: order.paymentStatus,
            orderStatus: order.status,
          },
        });
      }

      // If payment is already confirmed, return status
      if (order.paymentStatus === 'paid') {
        return res.json({
          success: true,
          data: {
            orderId: order.orderNumber,
            orderDbId: order._id.toString(), // Add database order ID for frontend navigation
            paymentStatus: order.paymentStatus,
            orderStatus: order.status,
          },
        });
      }

      // Query MoMo for latest status
      try {
        const requestId = Date.now().toString();
        const momoStatus = await MomoService.queryPaymentStatus(
          order.orderNumber,
          requestId
        );

        // Update order if payment is confirmed
        // For online payments (momo/zalopay), auto-confirm payment and order
        if (momoStatus.resultCode === 0) {
          order.paymentStatus = 'paid';
          order.status = 'confirmed';
          await order.save();
          console.log(`Order ${order.orderNumber} payment confirmed via MoMo query - Auto confirmed payment and order`);
        }

        return res.json({
          success: true,
          data: {
            orderId: order.orderNumber,
            orderDbId: order._id.toString(), // Add database order ID for frontend navigation
            paymentStatus: order.paymentStatus,
            orderStatus: order.status,
            momoStatus: momoStatus,
          },
        });
      } catch (queryError: any) {
        // If query fails, still return current order status
        console.error('MoMo query error, returning current order status:', queryError);
        return res.json({
          success: true,
          data: {
            orderId: order.orderNumber,
            orderDbId: order._id.toString(),
            paymentStatus: order.paymentStatus,
            orderStatus: order.status,
            queryError: queryError.message,
          },
        });
      }
    } catch (error: any) {
      console.error('Get payment status error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get payment status',
      });
    }
  }

  /**
   * Test VNPay credentials and environment configuration
   * GET /api/payment/vnpay/test-credentials
   */
  static async testVnpayCredentials(req: Request, res: Response) {
    try {
      const envVars = {
        VNPAY_TMN_CODE: process.env.VNPAY_TMN_CODE || 'NOT SET',
        VNPAY_HASH_SECRET: process.env.VNPAY_HASH_SECRET ? '***SET***' : 'NOT SET',
        VNPAY_RETURN_URL: process.env.VNPAY_RETURN_URL || 'NOT SET',
        VNPAY_IPN_URL: process.env.VNPAY_IPN_URL || 'NOT SET',
        VNPAY_URL: process.env.VNPAY_URL || 'NOT SET',
        NODE_ENV: process.env.NODE_ENV || 'NOT SET',
        CORS_ORIGIN: process.env.CORS_ORIGIN || 'NOT SET',
      };

      // Test creating a payment URL
      const testResult = VnpayService.testCredentials();

      // Get detected URLs from request
      const detectedReturnUrl = PaymentController.getBaseUrl(req, false);
      const detectedIpnUrl = PaymentController.getBaseUrl(req, true);

      res.json({
        success: true,
        environment: {
          nodeEnv: process.env.NODE_ENV,
          isProduction: process.env.NODE_ENV === 'production',
        },
        environmentVariables: envVars,
        detectedUrls: {
          returnUrl: detectedReturnUrl,
          ipnUrl: detectedIpnUrl,
        },
        testResult: testResult,
        recommendations: {
          ...(envVars.VNPAY_RETURN_URL === 'NOT SET' && {
            returnUrl: '⚠️ Set VNPAY_RETURN_URL in Render environment variables',
          }),
          ...(envVars.VNPAY_IPN_URL === 'NOT SET' && {
            ipnUrl: '⚠️ Set VNPAY_IPN_URL in Render environment variables',
          }),
          ...(detectedReturnUrl.includes('localhost') && process.env.NODE_ENV === 'production' && {
            critical: '❌ CRITICAL: ReturnUrl is using localhost in production!',
          }),
        },
      });
    } catch (error: any) {
      console.error('Test VNPay credentials error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to test VNPay credentials',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  }

  /**
   * Create VNPay payment request
   * POST /api/payment/vnpay/create
   */
  static async createVnpayPayment(req: Request, res: Response) {
    try {
      const { orderId, amount, orderInfo } = req.body;

      console.log('VNPay create request body:', { orderId, amount, orderInfo });

      if (!orderId || !amount) {
        return res.status(400).json({
          success: false,
          message: 'Order ID and amount are required',
        });
      }

      // Verify order exists
      const order = await Order.findById(orderId);
      if (!order) {
        console.error('VNPay create: order not found', { orderId });
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // If user is authenticated, verify order belongs to them
      const authReq = req as AuthenticatedRequest;
      if (authReq.user?.id && order.userId && order.userId.toString() !== authReq.user.id) {
        console.error('VNPay create: unauthorized order access', { user: authReq.user?.id, orderUser: order.userId?.toString() });
        return res.status(403).json({
          success: false,
          message: 'Unauthorized access to this order',
        });
      }

      // Verify order amount matches
      if (order.totalAmount !== amount) {
        console.error('VNPay create: amount mismatch', { orderAmount: order.totalAmount, clientAmount: amount });
        return res.status(400).json({
          success: false,
          message: 'Amount mismatch',
        });
      }

      // Verify payment method is vnpay
      if (order.paymentMethod !== 'vnpay') {
        console.error('VNPay create: wrong payment method', { orderMethod: order.paymentMethod });
        return res.status(400).json({
          success: false,
          message: 'Order payment method is not VNPay',
        });
      }

      // VNPay requires vnp_TxnRef to be alphanumeric only (no hyphen/space)
      const txnRef = order.orderNumber.replace(/[^A-Za-z0-9]/g, '');

      // Get client IP address from request
      // Priority: x-forwarded-for (from reverse proxy) > x-real-ip > req.ip > socket.remoteAddress
      // On Render, x-forwarded-for contains the real client IP
      let clientIp = '127.0.0.1'; // Default fallback
      
      // Check x-forwarded-for first (most reliable on Render/cloud platforms)
      if (req.headers['x-forwarded-for']) {
        const forwardedIps = String(req.headers['x-forwarded-for']).split(',');
        clientIp = forwardedIps[0].trim();
        console.log('📡 Client IP from x-forwarded-for:', clientIp, '(all IPs:', forwardedIps, ')');
      } else if (req.headers['x-real-ip']) {
        clientIp = String(req.headers['x-real-ip']).trim();
        console.log('📡 Client IP from x-real-ip:', clientIp);
      } else if (req.ip) {
        clientIp = req.ip;
        console.log('📡 Client IP from req.ip:', clientIp);
      } else if (req.socket.remoteAddress) {
        clientIp = req.socket.remoteAddress;
        console.log('📡 Client IP from socket.remoteAddress:', clientIp);
      } else {
        console.warn('⚠️ Could not determine client IP, using fallback 127.0.0.1');
      }
      
      // Convert IPv6 localhost to IPv4
      if (clientIp === '::1' || clientIp === '::ffff:127.0.0.1' || clientIp.startsWith('::ffff:127.0.0.1')) {
        clientIp = '127.0.0.1';
        console.log('📡 Converted IPv6 localhost to IPv4:', clientIp);
      }
      
      // Log all IP-related headers for debugging
      console.log('📡 IP Detection Debug:', {
        'x-forwarded-for': req.headers['x-forwarded-for'],
        'x-real-ip': req.headers['x-real-ip'],
        'req.ip': req.ip,
        'socket.remoteAddress': req.socket.remoteAddress,
        'finalClientIp': clientIp,
      });

      // Get return URL from request (auto-detect production URL)
      let returnUrl: string;
      let ipnUrl: string;
      
      try {
        returnUrl = PaymentController.getBaseUrl(req, false);
        ipnUrl = PaymentController.getBaseUrl(req, true);
      } catch (urlError: any) {
        console.error('Error getting base URL:', urlError);
        // Fallback to environment variables
        returnUrl = process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment-success';
        ipnUrl = process.env.VNPAY_IPN_URL || 'http://localhost:5000/api/payment/vnpay/callback';
        console.log('Using fallback URLs:', { returnUrl, ipnUrl });
      }

      console.log('Creating VNPay payment request:', {
        orderId: txnRef,
        amount: amount,
        orderInfo: orderInfo || `Thanh toán đơn hàng ${order.orderNumber}`,
        clientIp: clientIp,
        originalOrderNumber: order.orderNumber,
        returnUrl: returnUrl,
        ipnUrl: ipnUrl,
        requestHeaders: {
          host: req.headers.host,
          'x-forwarded-host': req.headers['x-forwarded-host'],
          'x-forwarded-proto': req.headers['x-forwarded-proto'],
        },
      });

      // Log IPN URL configuration status
      if (!ipnUrl.includes('localhost')) {
        console.log('✅ IPN URL Configuration:');
        console.log(`   IPN URL: ${ipnUrl}`);
        console.log('   ⚠️  Đảm bảo IPN URL này đã được đăng ký trong VNPay Merchant Portal');
        console.log('   Kiểm tra tại: https://sandbox.vnpayment.vn/vnpaygw-sit-testing/ipn');
      }

      // Log warning if using localhost in production
      if (process.env.NODE_ENV === 'production' && returnUrl.includes('localhost')) {
        console.error('❌ CRITICAL: VNPay ReturnUrl is using localhost in production!');
        console.error('   Please set VNPAY_RETURN_URL environment variable');
        console.error('   Example: VNPAY_RETURN_URL=https://yourdomain.com/payment-success');
      }
      
      if (process.env.NODE_ENV === 'production' && ipnUrl.includes('localhost')) {
        console.error('❌ CRITICAL: VNPay IPN URL is using localhost in production!');
        console.error('   Please set VNPAY_IPN_URL environment variable');
        console.error('   Example: VNPAY_IPN_URL=https://yourdomain.com/api/payment/vnpay/callback');
      }

      // Create VNPay payment URL
      let payUrl: string;
      try {
        payUrl = VnpayService.createPaymentUrl({
          orderId: txnRef, // sanitized for VNPay
          orderInfo: orderInfo || `Thanh toán đơn hàng ${order.orderNumber}`,
          amount: amount,
          extraData: orderId, // Store database order ID in extraData for callback
          ipAddr: clientIp, // Pass client IP address
          returnUrl: returnUrl, // Pass dynamic return URL
          ipnUrl: ipnUrl, // Pass dynamic IPN URL (for reference, not used in URL creation)
        });
      } catch (createUrlError: any) {
        console.error('Error creating VNPay payment URL:', createUrlError);
        console.error('Error details:', {
          message: createUrlError.message,
          stack: createUrlError.stack,
          orderId: txnRef,
          returnUrl: returnUrl,
        });
        throw createUrlError; // Re-throw to be caught by outer try-catch
      }

      console.log('VNPay payment URL created successfully');

      res.json({
        success: true,
        data: {
          payUrl: payUrl,
          orderId: order.orderNumber,
        },
      });
    } catch (error: any) {
      console.error('Create VNPay payment error:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create VNPay payment',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  }

  /**
   * Handle VNPay callback (IPN)
   * GET /api/payment/vnpay/callback
   */
  static async handleVnpayCallback(req: Request, res: Response) {
    try {
      console.log('📨 ========== VNPay IPN Callback Received ==========');
      console.log('📨 Request method:', req.method);
      console.log('📨 Request URL:', req.url);
      console.log('📨 Request headers:', JSON.stringify(req.headers, null, 2));
      console.log('📨 Query params:', JSON.stringify(req.query, null, 2));
      
      const callbackData = req.query as any as VnpayCallbackData;

      console.log('📨 VNPay callback data:', callbackData);
      console.log('📨 vnp_ResponseCode:', callbackData.vnp_ResponseCode);
      console.log('📨 vnp_TransactionStatus:', callbackData.vnp_TransactionStatus);
      console.log('📨 vnp_TxnRef:', callbackData.vnp_TxnRef);

      // Verify signature
      console.log('🔐 Verifying signature...');
      const isValid = VnpayService.verifySecureHash(callbackData);
      console.log('🔐 Signature valid:', isValid);
      
      if (!isValid) {
        console.error('❌ Invalid VNPay callback signature');
        // VNPay expects 200 status even for invalid signature
        return res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
      }

      // Extract order ID from vnp_TxnRef (orderNumber) or extraData (database orderId)
      let order;
      
      // Try to find by orderNumber first (vnp_TxnRef)
      order = await Order.findOne({
        orderNumber: callbackData.vnp_TxnRef,
      });

      // If not found, try by sanitized orderNumber (remove non-alphanumeric)
      if (!order) {
        const sanitizedRef = callbackData.vnp_TxnRef?.replace(/[^A-Za-z0-9]/g, '');
        if (sanitizedRef) {
          order = await Order.findOne({ orderNumber: sanitizedRef });
        }
      }

      // If not found and extraData exists, try to find by database orderId
      if (!order && callbackData.vnp_ExtraData) {
        try {
          const extraData = Buffer.from(callbackData.vnp_ExtraData, 'base64').toString('utf-8');
          order = await Order.findById(extraData);
        } catch (e) {
          console.warn('Failed to decode extraData:', e);
        }
      }

      if (!order) {
        console.error('❌ Order not found for VNPay callback:', {
          vnp_TxnRef: callbackData.vnp_TxnRef,
          vnp_ExtraData: callbackData.vnp_ExtraData,
        });
        // VNPay expects 200 status even if order not found
        return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
      }
      
      console.log('✅ Order found:', order.orderNumber);

      // Update order payment status based on vnp_ResponseCode
      // vnp_ResponseCode = '00': Success
      // vnp_TransactionStatus = '00': Success
      if (callbackData.vnp_ResponseCode === '00' && callbackData.vnp_TransactionStatus === '00') {
        // For online payments (vnpay), auto-confirm payment and order
        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        // Store VNPay transaction info
        if (!order.vnpayTransactionNo) {
          order.vnpayTransactionNo = callbackData.vnp_TransactionNo;
        }
        await order.save();

        console.log(`Order ${order.orderNumber} payment confirmed via VNPay - Auto confirmed payment and order`);
      } else {
        order.paymentStatus = 'failed';
        await order.save();

        console.log(
          `Order ${order.orderNumber} payment failed via VNPay: ResponseCode=${callbackData.vnp_ResponseCode}, TransactionStatus=${callbackData.vnp_TransactionStatus}`
        );
      }

      // Return success to VNPay (VNPay expects JSON response)
      console.log('✅ Returning success response to VNPay');
      return res.status(200).json({ RspCode: '00', Message: 'success' });
    } catch (error: any) {
      console.error('❌ VNPay callback error:', error);
      console.error('❌ Error stack:', error.stack);
      // VNPay expects 200 status even for errors
      return res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
    }
  }

  /**
   * Query VNPay payment status
   * GET /api/payment/vnpay/status/:orderId
   */
  static async getVnpayPaymentStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { vnp_ResponseCode } = req.query; // Get vnp_ResponseCode from query params if available

      // Try to find order by orderNumber first
      let order = await Order.findOne({ orderNumber: orderId });
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // If vnp_ResponseCode is provided and is '00', confirm payment immediately
      // This handles the case when user is redirected from VNPay with vnp_ResponseCode=00
      if (vnp_ResponseCode === '00') {
        if (order.paymentStatus !== 'paid') {
          order.paymentStatus = 'paid';
          order.status = 'confirmed';
          await order.save();
          console.log(`Order ${order.orderNumber} payment confirmed via vnp_ResponseCode=00 - Auto confirmed payment and order`);
        }
        return res.json({
          success: true,
          data: {
            orderId: order.orderNumber,
            orderDbId: order._id.toString(),
            paymentStatus: order.paymentStatus,
            orderStatus: order.status,
          },
        });
      }

      // If payment is already confirmed, return status
      if (order.paymentStatus === 'paid') {
        return res.json({
          success: true,
          data: {
            orderId: order.orderNumber,
            orderDbId: order._id.toString(),
            paymentStatus: order.paymentStatus,
            orderStatus: order.status,
          },
        });
      }

      // Query VNPay for latest status
      try {
        const vnpayStatus = await VnpayService.queryPaymentStatus(order.orderNumber);

        // Update order if payment is confirmed
        // For online payments (vnpay), auto-confirm payment and order
        if (vnpayStatus.vnp_ResponseCode === '00' && vnpayStatus.vnp_TransactionStatus === '00') {
          order.paymentStatus = 'paid';
          order.status = 'confirmed';
          if (!order.vnpayTransactionNo && vnpayStatus.vnp_TransactionNo) {
            order.vnpayTransactionNo = vnpayStatus.vnp_TransactionNo;
          }
          await order.save();
          console.log(`Order ${order.orderNumber} payment confirmed via VNPay query - Auto confirmed payment and order`);
        }

        return res.json({
          success: true,
          data: {
            orderId: order.orderNumber,
            orderDbId: order._id.toString(),
            paymentStatus: order.paymentStatus,
            orderStatus: order.status,
            vnpayStatus: vnpayStatus,
          },
        });
      } catch (queryError: any) {
        // If query fails, still return current order status
        console.error('VNPay query error, returning current order status:', queryError);
        return res.json({
          success: true,
          data: {
            orderId: order.orderNumber,
            orderDbId: order._id.toString(),
            paymentStatus: order.paymentStatus,
            orderStatus: order.status,
            queryError: queryError.message,
          },
        });
      }
    } catch (error: any) {
      console.error('Get VNPay payment status error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get payment status',
      });
    }
  }

  /**
   * Test VNPay credentials
   * GET /api/payment/vnpay/test-credentials
   */
  static async testVnpayCredentials(req: Request, res: Response) {
    try {
      const testResult = VnpayService.testCredentials();
      
      // Additional checks
      const checks = {
        tmnCodeFormat: /^[A-Z0-9]{8}$/.test(testResult.details.tmnCode),
        hashSecretFormat: testResult.details.hashSecretLength >= 32,
        returnUrlFormat: testResult.details.returnUrl.startsWith('http'),
      };

      const allChecksPass = Object.values(checks).every(v => v === true);

      res.json({
        success: true,
        data: {
          ...testResult,
          checks,
          allChecksPass,
          recommendations: [
            '1. Đăng nhập VNPay Merchant Portal: https://sandbox.vnpayment.vn/merchant/',
            '2. Kiểm tra TMN Code và Hash Secret trong phần "Thông tin tích hợp"',
            '3. Xác nhận credentials còn hiệu lực (không bị khóa hoặc hết hạn)',
            '4. Kiểm tra ReturnUrl có được cấu hình đúng trong VNPay portal không',
            '5. Nếu vẫn lỗi code=99, thử dùng credentials từ code demo thành công (nếu có)',
            '6. Liên hệ VNPay support: hotrovnpay@vnpay.vn hoặc 1900 55 55 77',
          ],
        },
      });
    } catch (error: any) {
      console.error('Test VNPay credentials error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to test credentials',
      });
    }
  }
}

