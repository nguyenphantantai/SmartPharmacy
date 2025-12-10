import crypto from 'crypto';
import axios from 'axios';

// MoMo Sandbox Configuration
// Reference: https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
const MOMO_CONFIG = {
  partnerCode: 'MOMO',
  accessKey: 'F8BBA842ECF85',
  secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz', // Fixed: 'l' not '1' at the end
  endpoint: 'https://test-payment.momo.vn/v2/gateway/api/create',
  redirectUrl: 'http://localhost:3000/payment-success',
  ipnUrl: 'http://localhost:5000/api/payment/momo/callback',
};

export interface MomoPaymentRequest {
  orderId: string;
  orderInfo: string;
  amount: number;
  extraData?: string;
}

export interface MomoPaymentResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl?: string;
  qrCodeUrl?: string;
  deeplink?: string;
}

export interface MomoCallbackData {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  orderInfo: string;
  orderType: string;
  transId: number;
  resultCode: number;
  message: string;
  payType: string;
  responseTime: number;
  extraData?: string;
  signature: string;
}

export class MomoService {

  /**
   * Create signature for MoMo API query payment status
   * Format: accessKey=...&orderId=...&partnerCode=...&requestId=...
   */
  private static createQuerySignature(data: Record<string, any>): string {
    // MoMo API v2 query signature format
    // Fields must be in alphabetical order: accessKey, orderId, partnerCode, requestId
    
    // Extract values - ensure all are strings
    const accessKey = MOMO_CONFIG.accessKey;
    const orderId = String(data.orderId);
    const partnerCode = String(data.partnerCode);
    const requestId = String(data.requestId);
    
    // Build signature string in alphabetical order (no URL encoding)
    const rawSignature = [
      `accessKey=${accessKey}`,
      `orderId=${orderId}`,
      `partnerCode=${partnerCode}`,
      `requestId=${requestId}`,
    ].join('&');
    
    console.log('Raw signature string (query):', rawSignature);
    
    // Create HMAC SHA256 signature
    const signature = crypto
      .createHmac('sha256', MOMO_CONFIG.secretKey)
      .update(rawSignature)
      .digest('hex');
    
    console.log('Generated query signature:', signature);
    
    return signature;
  }

  /**
   * Verify signature from MoMo callback
   */
  static verifySignature(data: MomoCallbackData): boolean {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = data;

    const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&amount=${amount}&extraData=${extraData || ''}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const calculatedSignature = crypto
      .createHmac('sha256', MOMO_CONFIG.secretKey)
      .update(rawSignature)
      .digest('hex');

    return calculatedSignature === signature;
  }

  /**
   * Create payment request to MoMo
   * Following the algorithm from MoMo documentation
   */
  static async createPaymentRequest(
    request: MomoPaymentRequest
  ): Promise<MomoPaymentResponse> {
    // Generate requestId: partnerCode + timestamp (as in MoMo.js example)
    const requestId = MOMO_CONFIG.partnerCode + Date.now().toString();
    // In MoMo.js example: orderId = requestId (they must be the same)
    const orderId = requestId; // Use requestId as orderId (as in MoMo.js example)
    const requestType = 'captureWallet';
    const lang = 'en';
    const extraData = request.extraData || ''; // pass empty value if merchant does not have stores
    const amount = String(request.amount); // Convert to string as in MoMo.js example

    // Build raw signature string (exactly as in MoMo.js example)
    // Format: accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    const rawSignature = 
      "accessKey=" + MOMO_CONFIG.accessKey +
      "&amount=" + amount +
      "&extraData=" + extraData +
      "&ipnUrl=" + MOMO_CONFIG.ipnUrl +
      "&orderId=" + orderId +
      "&orderInfo=" + request.orderInfo +
      "&partnerCode=" + MOMO_CONFIG.partnerCode +
      "&redirectUrl=" + MOMO_CONFIG.redirectUrl +
      "&requestId=" + requestId +
      "&requestType=" + requestType;

    console.log("--------------------RAW SIGNATURE----------------");
    console.log(rawSignature);

    // Create signature using HMAC SHA256 (exactly as in MoMo.js example)
    const signature = crypto
      .createHmac('sha256', MOMO_CONFIG.secretKey)
      .update(rawSignature)
      .digest('hex');

    console.log("--------------------SIGNATURE----------------");
    console.log(signature);
    
    // Build final request body (exactly as in MoMo.js example)
    // JSON object send to MoMo endpoint
    const requestBody = {
      partnerCode: MOMO_CONFIG.partnerCode,
      accessKey: MOMO_CONFIG.accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: request.orderInfo,
      redirectUrl: MOMO_CONFIG.redirectUrl,
      ipnUrl: MOMO_CONFIG.ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: lang,
      // Add validity parameter (in minutes) to prevent transaction expiration
      // Default: 15 minutes (900 seconds) - adjust as needed
      validity: 15, // Transaction valid for 15 minutes
    };

    console.log('MoMo payment request body:', JSON.stringify(requestBody, null, 2));
    console.log('MoMo signature:', signature);

    try {
      // Send request to MoMo endpoint
      const response = await axios.post<MomoPaymentResponse>(
        MOMO_CONFIG.endpoint,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      console.log('MoMo API response:', response.data);

      if (response.data.resultCode !== 0) {
        console.error('MoMo API error:', response.data);
        throw new Error(
          response.data.message || 'Failed to create MoMo payment request'
        );
      }

      return response.data;
    } catch (error: any) {
      console.error('MoMo payment request error:', error);
      if (error.response) {
        console.error('MoMo API error response:', error.response.data);
        console.error('MoMo API error status:', error.response.status);
        throw new Error(
          error.response.data?.message || error.response.data || 'Failed to create MoMo payment request'
        );
      }
      if (error.request) {
        console.error('MoMo API request error - no response:', error.request);
        throw new Error('Không thể kết nối đến MoMo API. Vui lòng thử lại sau.');
      }
      throw error;
    }
  }

  /**
   * Query payment status from MoMo
   */
  static async queryPaymentStatus(
    orderId: string,
    requestId: string
  ): Promise<any> {
    const queryUrl = 'https://test-payment.momo.vn/v2/gateway/api/query';
    
    // Query API only needs: accessKey, orderId, partnerCode, requestId
    const requestData: Record<string, any> = {
      accessKey: MOMO_CONFIG.accessKey,
      partnerCode: MOMO_CONFIG.partnerCode,
      orderId: orderId,
      requestId: requestId,
      lang: 'en', // Use 'en' as in MoMo documentation
    };

    // Create query signature (only includes accessKey, orderId, partnerCode, requestId)
    const signature = this.createQuerySignature(requestData);
    requestData.signature = signature;

    console.log('MoMo query request data:', JSON.stringify(requestData, null, 2));

    try {
      const response = await axios.post(queryUrl, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('MoMo query response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('MoMo query payment status error:', error);
      if (error.response) {
        console.error('MoMo query error response:', error.response.data);
      }
      throw error;
    }
  }
}

