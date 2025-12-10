import crypto from 'crypto';
import qs from 'qs';

// VNPay Sandbox Configuration
// Reference: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html
// IMPORTANT: Trim hash secret to avoid issues with whitespace
const VNPAY_CONFIG = {
  tmnCode: (process.env.VNPAY_TMN_CODE || 'JQV2XIVU').trim(),
  hashSecret: (process.env.VNPAY_HASH_SECRET || 'UC3W9EZFGKNEG1F038WJ4W8WZ01OQ2A7').trim(),
  url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  returnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment-success',
  ipnUrl: process.env.VNPAY_IPN_URL || 'http://localhost:5000/api/payment/vnpay/callback',
};

// Validate hash secret format
if (VNPAY_CONFIG.hashSecret.length !== 32) {
  console.warn(`⚠️ WARNING: VNPay hash secret length is ${VNPAY_CONFIG.hashSecret.length}, expected 32 characters`);
}

export interface VnpayPaymentRequest {
  orderId: string;
  orderInfo: string;
  amount: number;
  extraData?: string;
  ipAddr?: string; // Client IP address
  returnUrl?: string; // Frontend return URL (optional, will use env or auto-detect)
  ipnUrl?: string; // Backend callback URL (optional, will use env or auto-detect)
}

export interface VnpayPaymentResponse {
  payUrl: string;
  orderId: string;
}

export interface VnpayCallbackData {
  vnp_TmnCode: string;
  vnp_Amount: string;
  vnp_BankCode?: string;
  vnp_BankTranNo?: string;
  vnp_CardType?: string;
  vnp_PayDate: string;
  vnp_OrderInfo: string;
  vnp_TransactionNo: string;
  vnp_ResponseCode: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
  vnp_SecureHash: string;
  vnp_SecureHashType?: string;
  vnp_ExtraData?: string;
}

export class VnpayService {
  /**
   * Normalize Vietnamese text: remove diacritics and special characters
   * VNPay requires vnp_OrderInfo to be Vietnamese without diacritics and no special characters
   */
  private static normalizeOrderInfo(text: string): string {
    // Remove Vietnamese diacritics
    const diacriticsMap: { [key: string]: string } = {
      'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
      'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
      'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
      'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
      'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
      'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
      'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
      'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
      'đ': 'd',
      'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A', 'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A',
      'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
      'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
      'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
      'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O',
      'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
      'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
      'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
      'Đ': 'D',
    };

    let normalized = text;
    for (const [diacritic, replacement] of Object.entries(diacriticsMap)) {
      normalized = normalized.replace(new RegExp(diacritic, 'g'), replacement);
    }

    // Remove special characters (keep only alphanumeric, spaces, and basic punctuation)
    normalized = normalized.replace(/[^a-zA-Z0-9\s.,:]/g, ' ');

    // Normalize multiple spaces to single space
    normalized = normalized.replace(/\s+/g, ' ').trim();

    return normalized;
  }

  /**
   * Sort object by key alphabetically (VNPay requirement)
   * Following VNPay official demo code EXACTLY (line 304-318)
   * sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
   */
  private static sortObject(obj: Record<string, any>): Record<string, any> {
    const sorted: Record<string, any> = {};
    const str: string[] = [];
    
    // Get all keys and encode them (exactly like VNPay demo line 308-311)
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    
    // Sort encoded keys (exactly like VNPay demo line 313)
    str.sort();
    
    // Build sorted object (exactly like VNPay demo line 314-316)
    // sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    // IMPORTANT: obj[str[key]] uses encoded key to access original object
    // This works because for VNPay keys: encodeURIComponent('vnp_Amount') === 'vnp_Amount'
    for (let i = 0; i < str.length; i++) {
      const encodedKey = str[i];
      if (!encodedKey) continue;
      
      // Use obj[str[key]] directly like VNPay demo (line 315)
      // For VNPay keys without special chars, encodedKey === originalKey
      // So obj[encodedKey] works correctly
      const originalValue = (obj as any)[encodedKey];
      
      // Encode value and replace %20 with + (exactly like VNPay demo line 315)
      // IMPORTANT: Only include if value is not undefined/null/empty
      // VNPay demo code includes all keys, but we should skip undefined to avoid issues
      if (originalValue !== undefined && originalValue !== null && originalValue !== '') {
        sorted[encodedKey] = encodeURIComponent(String(originalValue)).replace(/%20/g, '+');
      }
    }
    
    return sorted;
  }

  /**
   * Create secure hash for VNPay from already-sorted data
   * According to VNPay demo code:
   * 1. Data is already sorted (vnp_Params = sortObject(vnp_Params))
   * 2. Create query string using qs.stringify with encode: false
   * 3. Create HMAC SHA512 hash
   */
  private static createSecureHashFromSorted(sortedData: Record<string, any>): string {
    // Remove vnp_SecureHash and vnp_SecureHashType if present (they shouldn't be in hash calculation)
    // IMPORTANT: Keep all other fields (like VNPay demo line 82)
    const dataToHash: Record<string, any> = {};
    for (const key in sortedData) {
      if (key !== 'vnp_SecureHash' && key !== 'vnp_SecureHashType') {
        dataToHash[key] = sortedData[key];
      }
    }
    
    // Create query string using qs.stringify with encode: false (exactly like VNPay demo line 82)
    // let signData = querystring.stringify(vnp_Params, { encode: false });
    // Note: qs.stringify will automatically skip undefined/null, but keep empty strings
    const signData = qs.stringify(dataToHash, { encode: false });

    // Use hash secret from config (already trimmed)
    const hashSecret = VNPAY_CONFIG.hashSecret;
    
    // Always log in production for debugging code=99 errors
    console.log('🔐 VNPay Hash Calculation Debug:');
    console.log('   Sign data (query string):', signData);
    console.log('   Hash secret length:', hashSecret.length);
    console.log('   Hash secret (first 10 chars):', hashSecret.substring(0, 10) + '...');
    console.log('   Hash secret (last 10 chars):', '...' + hashSecret.substring(hashSecret.length - 10));
    console.log('   Sorted data keys:', Object.keys(dataToHash).join(', '));
    
    // Create HMAC SHA512 hash (NOT SHA256! VNPay uses SHA512)
    // Following VNPay demo line 84-85: hmac.update(new Buffer(signData, 'utf-8'))
    // IMPORTANT: HMAC uses hashSecret as KEY, signData as DATA (NOT append hashSecret to signData!)
    const hmac = crypto.createHmac('sha512', hashSecret);
    const secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    console.log('   Calculated hash:', secureHash);
    console.log('   Hash length:', secureHash.length, '(should be 128 for SHA512)');
    
    return secureHash;
  }

  /**
   * Create secure hash for VNPay (for callback verification - data may not be sorted)
   */
  private static createSecureHash(data: Record<string, any>): string {
    // Remove vnp_SecureHash and vnp_SecureHashType if present
    const dataToHash: Record<string, any> = {};
    for (const key in data) {
      if (key !== 'vnp_SecureHash' && key !== 'vnp_SecureHashType' && data[key] !== null && data[key] !== undefined && data[key] !== '') {
        dataToHash[key] = String(data[key]);
      }
    }
    
    // Sort data before hashing
    const sortedData = this.sortObject(dataToHash);
    const signData = qs.stringify(sortedData, { encode: false });
    
    const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.hashSecret);
    const secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    return secureHash;
  }

  /**
   * Verify secure hash from VNPay callback
   */
  static verifySecureHash(data: VnpayCallbackData): boolean {
    const {
      vnp_TmnCode,
      vnp_Amount,
      vnp_BankCode,
      vnp_BankTranNo,
      vnp_CardType,
      vnp_PayDate,
      vnp_OrderInfo,
      vnp_TransactionNo,
      vnp_ResponseCode,
      vnp_TransactionStatus,
      vnp_TxnRef,
      vnp_SecureHash,
    } = data;

    // Build data object (exclude vnp_SecureHash and vnp_SecureHashType)
    const dataToVerify: Record<string, any> = {
      vnp_TmnCode,
      vnp_Amount,
      vnp_OrderInfo,
      vnp_TransactionNo,
      vnp_ResponseCode,
      vnp_TransactionStatus,
      vnp_TxnRef,
      vnp_PayDate,
    };

    // Add optional fields if present
    if (vnp_BankCode) dataToVerify.vnp_BankCode = vnp_BankCode;
    if (vnp_BankTranNo) dataToVerify.vnp_BankTranNo = vnp_BankTranNo;
    if (vnp_CardType) dataToVerify.vnp_CardType = vnp_CardType;
    if (data.vnp_ExtraData) dataToVerify.vnp_ExtraData = data.vnp_ExtraData;

    // Create secure hash using same method as createPaymentUrl
    const sortedData = this.sortObject(dataToVerify);
    const signData = qs.stringify(sortedData, { encode: false });
    
    // Create HMAC SHA512 hash
    const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.hashSecret);
    const calculatedHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (process.env.NODE_ENV === 'development') {
      console.log('VNPay callback hash verification:', {
        calculated: calculatedHash,
        received: vnp_SecureHash,
        match: calculatedHash === vnp_SecureHash,
      });
    }

    return calculatedHash === vnp_SecureHash;
  }

  /**
   * Create payment URL for VNPay
   */
  static createPaymentUrl(request: VnpayPaymentRequest): string {
    // Set timezone to Asia/Ho_Chi_Minh (like VNPay demo)
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const date = new Date();
    
    // Format date as YYYYMMDDHHmmss (no Z, no timezone)
    const createDate = date.getFullYear().toString() +
      String(date.getMonth() + 1).padStart(2, '0') +
      String(date.getDate()).padStart(2, '0') +
      String(date.getHours()).padStart(2, '0') +
      String(date.getMinutes()).padStart(2, '0') +
      String(date.getSeconds()).padStart(2, '0');
    
    const expireDateObj = new Date(date.getTime() + 15 * 60 * 1000); // 15 minutes
    const expireDate = expireDateObj.getFullYear().toString() +
      String(expireDateObj.getMonth() + 1).padStart(2, '0') +
      String(expireDateObj.getDate()).padStart(2, '0') +
      String(expireDateObj.getHours()).padStart(2, '0') +
      String(expireDateObj.getMinutes()).padStart(2, '0') +
      String(expireDateObj.getSeconds()).padStart(2, '0');

    // Get client IP address (use provided or default to 127.0.0.1 for localhost)
    const clientIp = request.ipAddr || '127.0.0.1';

    // Use provided returnUrl or fallback to env or default
    // IMPORTANT: When deployed, this must be a public URL, not localhost!
    const returnUrl = request.returnUrl || VNPAY_CONFIG.returnUrl;
    
    // Log URL configuration for debugging
    if (process.env.NODE_ENV === 'development' || returnUrl.includes('localhost')) {
      console.log('⚠️ VNPay ReturnUrl:', returnUrl);
      if (returnUrl.includes('localhost')) {
        console.log('⚠️ WARNING: Using localhost returnUrl. This will fail in production!');
        console.log('⚠️ Please set VNPAY_RETURN_URL environment variable to your production frontend URL');
      }
    }

    // Normalize orderInfo: remove Vietnamese diacritics and special characters
    // VNPay requires: "Tiếng Việt không dấu và không bao gồm các ký tự đặc biệt"
    // Also limit length to 100 characters (VNPay requirement)
    let normalizedOrderInfo = this.normalizeOrderInfo(request.orderInfo);
    if (normalizedOrderInfo.length > 100) {
      normalizedOrderInfo = normalizedOrderInfo.substring(0, 100);
    }

    // VNPay requires TxnRef to be alphanumeric only, max 40 characters
    let txnRef = request.orderId.replace(/[^A-Za-z0-9]/g, '');
    if (txnRef.length > 40) {
      txnRef = txnRef.substring(0, 40);
    }

    // Build payment data (without vnp_SecureHash - will be added after hash calculation)
    // NOTE: vnp_SecureHashType should NOT be in the URL - VNPay auto-detects SHA512 from hash length
    // NOTE: Code demo thành công có thể không có vnp_ExpireDate
    // Set VNPAY_SKIP_EXPIRE_DATE=true in .env to skip vnp_ExpireDate (for testing)
    const paymentData: Record<string, any> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: VNPAY_CONFIG.tmnCode,
      vnp_Amount: Math.round(request.amount * 100), // Convert to cents (VNPay requires amount in VND cents)
      vnp_CurrCode: 'VND',
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: normalizedOrderInfo, // Use normalized order info
      vnp_OrderType: 'other',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: returnUrl, // Use dynamic returnUrl
      vnp_IpAddr: clientIp,
      vnp_CreateDate: createDate,
    };
    
    // Add vnp_ExpireDate only if explicitly enabled
    // NOTE: Code demo thành công KHÔNG có vnp_ExpireDate
    // Mặc định bỏ vnp_ExpireDate để khớp với code demo thành công
    // Set VNPAY_INCLUDE_EXPIRE_DATE=true in .env to include it
    if (process.env.VNPAY_INCLUDE_EXPIRE_DATE === 'true') {
      paymentData.vnp_ExpireDate = expireDate;
    }

    // Debug: log outgoing payload (mask hash secret, exclude secure hash)
    console.log('VNPay payload (pre-hash):', {
      vnp_Version: paymentData.vnp_Version,
      vnp_Command: paymentData.vnp_Command,
      vnp_TmnCode: paymentData.vnp_TmnCode,
      vnp_Amount: paymentData.vnp_Amount,
      vnp_TxnRef: paymentData.vnp_TxnRef,
      vnp_OrderInfo: paymentData.vnp_OrderInfo,
      vnp_OrderInfoLength: paymentData.vnp_OrderInfo.length,
      vnp_TxnRefLength: paymentData.vnp_TxnRef.length,
      vnp_ReturnUrl: paymentData.vnp_ReturnUrl,
      vnp_IpAddr: paymentData.vnp_IpAddr,
      vnp_CreateDate: paymentData.vnp_CreateDate,
      vnp_ExpireDate: paymentData.vnp_ExpireDate,
      hasExtraData: Boolean(paymentData.vnp_ExtraData),
      hashAlgorithm: 'SHA512 (auto-detected by VNPay)',
    });

    // Add extraData if provided (must be base64 encoded)
    if (request.extraData) {
      paymentData.vnp_ExtraData = Buffer.from(request.extraData).toString('base64');
    }

    // Sort payment data BEFORE calculating hash (exactly like VNPay demo line 79)
    // vnp_Params = sortObject(vnp_Params);
    const sortedPaymentData = this.sortObject(paymentData);
    
    // Create secure hash from SORTED data (exactly like VNPay demo line 82-85)
    // IMPORTANT: Must use sortedPaymentData, not paymentData!
    // In demo: signData = querystring.stringify(vnp_Params, { encode: false })
    // where vnp_Params is already sorted
    const secureHash = this.createSecureHashFromSorted(sortedPaymentData);
    
    // Now add the hash to sorted data (exactly like VNPay demo line 86)
    // vnp_Params['vnp_SecureHash'] = signed;
    sortedPaymentData['vnp_SecureHash'] = secureHash;

    // Build final query string using qs.stringify with encode: false (exactly like VNPay demo line 87)
    // vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    // IMPORTANT: Do NOT sort again after adding hash - just stringify the sorted data with hash
    const queryString = qs.stringify(sortedPaymentData, { encode: false });
    
    console.log('VNPay final URL query string (first 200 chars):', queryString.substring(0, 200));

    // Create payment URL
    const payUrl = `${VNPAY_CONFIG.url}?${queryString}`;

    console.log('VNPay payment URL created:', {
      orderId: request.orderId,
      amount: request.amount,
      payUrl: payUrl.substring(0, 100) + '...',
    });
    
    // Debug: Log full URL in development (first 500 chars to avoid spam)
    if (process.env.NODE_ENV === 'development') {
      console.log('VNPay full URL (first 500 chars):', payUrl.substring(0, 500));
      console.log('VNPay URL parameters count:', Object.keys(sortedPaymentData).length);
      console.log('VNPay hash length:', secureHash.length, '(should be 128 for SHA512)');
      console.log('VNPay TMN Code:', VNPAY_CONFIG.tmnCode);
      console.log('VNPay ReturnUrl:', returnUrl);
      console.log('✅ VNPay Credentials Verified:');
      console.log('   TMN Code:', VNPAY_CONFIG.tmnCode, '(Đúng theo email VNPay)');
      console.log('   Hash Secret:', VNPAY_CONFIG.hashSecret.substring(0, 10) + '...', '(Đúng theo email VNPay)');
      console.log('');
      // Get IPN URL from request if provided, otherwise use config
      const ipnUrl = request.ipnUrl || VNPAY_CONFIG.ipnUrl;
      
      console.log('⚠️ VNPay Code=99 - Các bước khắc phục:');
      console.log('   1. ✅ IPN URL Configuration:');
      console.log('      - IPN URL đã được detect/configure:', ipnUrl);
      if (!ipnUrl.includes('localhost')) {
        console.log('      - ✅ IPN URL là production URL (không phải localhost)');
        console.log('      - ⚠️ QUAN TRỌNG: Đảm bảo IPN URL này đã được đăng ký trong VNPay Merchant Portal');
        console.log('      - Kiểm tra tại: https://sandbox.vnpayment.vn/vnpaygw-sit-testing/ipn');
        console.log('      - Terminal Code:', VNPAY_CONFIG.tmnCode);
        console.log('      - IPN URL phải khớp:', ipnUrl);
      } else {
        console.log('      - ⚠️ WARNING: IPN URL đang dùng localhost!');
        console.log('      - Khi deploy, phải set VNPAY_IPN_URL trong .env với URL production');
        console.log('      - Ví dụ: VNPAY_IPN_URL=https://yourdomain.com/api/payment/vnpay/callback');
        console.log('      - Sau đó đăng ký IPN URL trong VNPay Merchant Portal');
      }
      console.log('   2. Kiểm tra ReturnUrl có được chấp nhận không');
      console.log('      - ReturnUrl hiện tại:', returnUrl);
      if (returnUrl.includes('localhost')) {
        console.log('      - ⚠️ WARNING: ReturnUrl đang dùng localhost!');
        console.log('      - Khi deploy, phải set VNPAY_RETURN_URL trong .env với URL production');
        console.log('      - Ví dụ: VNPAY_RETURN_URL=https://yourdomain.com/payment-success');
      }
      console.log('   3. Test với thẻ test từ email VNPay:');
      console.log('      - Số thẻ: 9704198526191432198');
      console.log('      - Tên: NGUYEN VAN A');
      console.log('      - OTP: 123456');
      console.log('   4. Liên hệ VNPay support nếu vẫn lỗi:');
      console.log('      - Email: support.vnpayment@vnpay.vn');
      console.log('      - Hotline: 1900 55 55 77');
    }

    return payUrl;
  }

  /**
   * Test VNPay credentials by creating a test payment URL
   * This helps verify if credentials are correct
   */
  static testCredentials(): {
    isValid: boolean;
    message: string;
    details: {
      tmnCode: string;
      hashSecretLength: number;
      returnUrl: string;
      testPaymentUrl?: string;
    };
  } {
    const testRequest: VnpayPaymentRequest = {
      orderId: 'TEST123',
      orderInfo: 'Test credentials',
      amount: 10000, // 10,000 VND
      ipAddr: '127.0.0.1',
    };

    try {
      // Try to create a payment URL - if credentials are wrong, this might fail
      const testUrl = this.createPaymentUrl(testRequest);
      
      return {
        isValid: true,
        message: 'Credentials format is valid. URL created successfully. However, code=99 might still occur if credentials are expired or incorrect.',
        details: {
          tmnCode: VNPAY_CONFIG.tmnCode,
          hashSecretLength: VNPAY_CONFIG.hashSecret.length,
          returnUrl: VNPAY_CONFIG.returnUrl,
          testPaymentUrl: testUrl.substring(0, 200) + '...',
        },
      };
    } catch (error: any) {
      return {
        isValid: false,
        message: `Error creating payment URL: ${error.message}`,
        details: {
          tmnCode: VNPAY_CONFIG.tmnCode,
          hashSecretLength: VNPAY_CONFIG.hashSecret.length,
          returnUrl: VNPAY_CONFIG.returnUrl,
        },
      };
    }
  }

  /**
   * Query payment status from VNPay
   */
  static async queryPaymentStatus(orderId: string): Promise<any> {
    const date = new Date();
    const queryDate = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const txnRef = orderId.replace(/[^A-Za-z0-9]/g, '');

    const queryData: Record<string, any> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'querydr',
      vnp_TmnCode: VNPAY_CONFIG.tmnCode,
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Query payment status for order ${orderId}`,
      vnp_TransactionDate: queryDate,
      vnp_CreateDate: queryDate,
      vnp_IpAddr: '127.0.0.1',
      // NOTE: vnp_SecureHashType should NOT be in URL - VNPay auto-detects SHA512
    };

    // Create secure hash
    const secureHash = this.createSecureHash(queryData);
    queryData.vnp_SecureHash = secureHash;

    // Build query string (encode: false like VNPay demo)
    const sortedData = this.sortObject(queryData);
    const queryString = qs.stringify(sortedData, { encode: false });

    const queryUrl = `https://sandbox.vnpayment.vn/merchant_webapi/api/transaction?${queryString}`;

    console.log('VNPay query URL:', queryUrl.substring(0, 100) + '...');

    try {
      const axios = await import('axios');
      const response = await axios.default.get(queryUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      console.log('VNPay query response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('VNPay query payment status error:', error);
      if (error.response) {
        console.error('VNPay query error response:', error.response.data);
      }
      throw error;
    }
  }
}

