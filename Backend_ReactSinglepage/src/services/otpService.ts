export class OTPService {
  static async sendOTP(phone: string, otp: string, method: 'sms' | 'zalo' = 'sms'): Promise<boolean> {
    try {
      console.log(`\n🔐 ===== OTP FOR TESTING =====`);
      console.log(`📱 Phone: ${phone}`);
      console.log(`🔢 OTP Code: ${otp}`);
      console.log(`📡 Method: ${method.toUpperCase()}`);
      console.log(`⏰ Time: ${new Date().toLocaleString()}`);
      console.log(`⏳ Expires in: 5 minutes`);
      console.log(`🔐 ============================\n`);
      
      // In a real implementation, you would integrate with SMS/Zalo APIs here
      // For now, we'll just simulate success
      
      if (method === 'sms') {
        // Simulate SMS sending
        console.log(`📱 [SMS] OTP ${otp} sent to ${phone}`);
        return true;
      } else if (method === 'zalo') {
        // Simulate Zalo sending
        console.log(`📱 [Zalo] OTP ${otp} sent to ${phone}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    }
  }
}
