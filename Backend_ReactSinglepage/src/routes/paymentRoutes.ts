import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';

const router = Router();

// MoMo payment routes
// Note: create endpoint doesn't require auth to support guest orders
router.post('/momo/create', PaymentController.createMomoPayment);
router.post('/momo/callback', PaymentController.handleMomoCallback);
router.get('/momo/status/:orderId', PaymentController.getPaymentStatus);

// VNPay payment routes
// Note: create endpoint doesn't require auth to support guest orders
router.post('/vnpay/create', PaymentController.createVnpayPayment);
router.get('/vnpay/callback', PaymentController.handleVnpayCallback);
router.post('/vnpay/callback', PaymentController.handleVnpayCallback); // Support both GET and POST
router.get('/vnpay/status/:orderId', PaymentController.getVnpayPaymentStatus);
router.get('/vnpay/test-credentials', PaymentController.testVnpayCredentials);
router.get('/vnpay/test-ipn', PaymentController.testIpnEndpoint); // Test IPN endpoint accessibility
router.post('/vnpay/test-callback', PaymentController.testVnpayCallback); // Test IPN callback with Postman

export default router;

