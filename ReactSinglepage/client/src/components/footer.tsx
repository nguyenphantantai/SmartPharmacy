import { Facebook, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="fade-in">
            <div className="text-2xl font-bold mb-4 text-center">
              <div className="text-white text-shadow">NHÀ THUỐC</div>
              <div className="text-white text-shadow gradient-text">THÔNG MINH</div>
            </div>
            <p className="text-sm mb-4">
              Hệ thống nhà thuốc uy tín với hơn 1000 cửa hàng trên toàn quốc
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 hover:text-secondary cursor-pointer transition-all duration-300 hover:scale-125" data-testid="link-facebook" />
              <Instagram className="h-5 w-5 hover:text-secondary cursor-pointer transition-all duration-300 hover:scale-125" data-testid="link-instagram" />
              <Youtube className="h-5 w-5 hover:text-secondary cursor-pointer transition-all duration-300 hover:scale-125" data-testid="link-youtube" />
            </div>
          </div>
          
          {/* Customer Service */}
          <div className="slide-up">
            <h3 className="font-bold mb-4 text-shadow">Chăm sóc khách hàng</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-secondary transition-all duration-300 hover:translate-x-1" data-testid="link-consultation">📞 Tư vấn</a></li>
              <li><a href="#" className="hover:text-secondary transition-all duration-300 hover:translate-x-1" data-testid="link-pharmacist">💊 Hỏi dược sĩ</a></li>
              <li><a href="/track-order" className="hover:text-secondary transition-all duration-300 hover:translate-x-1" data-testid="link-track-order">📦 Theo dõi đơn hàng</a></li>
              <li><a href="#" className="hover:text-secondary transition-all duration-300 hover:translate-x-1" data-testid="link-return-policy">📋 Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-secondary transition-all duration-300 hover:translate-x-1" data-testid="link-delivery">🚚 Giao hàng</a></li>
              <li><a href="#" className="hover:text-secondary transition-all duration-300 hover:translate-x-1" data-testid="link-payment">💳 Thanh toán</a></li>
            </ul>
          </div>
          
          {/* Information */}
          <div className="bounce-in">
            <h3 className="font-bold mb-4 text-shadow">Thông tin</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-secondary transition-all duration-300 hover:translate-x-1" data-testid="link-about">🏥 Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-secondary transition-all duration-300 hover:translate-x-1" data-testid="link-terms">📝 Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-secondary transition-all duration-300 hover:translate-x-1" data-testid="link-privacy">🔒 Bảo mật thông tin</a></li>
              <li><a href="#" className="hover:text-secondary transition-all duration-300 hover:translate-x-1" data-testid="link-stores">📍 Tìm cửa hàng</a></li>
              <li><a href="#" className="hover:text-secondary transition-all duration-300 hover:translate-x-1" data-testid="link-careers">💼 Tuyển dụng</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="fade-in">
            <h3 className="font-bold mb-4 text-shadow">Liên hệ</h3>
            <div className="space-y-2 text-sm">
              <div data-testid="text-hotline" className="hover:text-secondary transition-colors duration-300">📞 Hotline: 1800 6928</div>
              <div data-testid="text-email" className="hover:text-secondary transition-colors duration-300">✉️ Email: info@Nhathuocthongminh.vn</div>
              <div data-testid="text-address" className="hover:text-secondary transition-colors duration-300">📍 Địa chỉ: 379 Hudson St, New York, NY 10014</div>
              <div data-testid="text-hours" className="hover:text-secondary transition-colors duration-300">⏰ Giờ làm việc: 8:00 - 22:00</div>
            </div>
          </div>
        </div>
        
        {/* Bottom footer */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm mb-4 md:mb-0 fade-in" data-testid="text-copyright">
              © 2024 Nhà Thuốc Thông Minh. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex items-center space-x-4 slide-up">
              <span className="text-sm">Phương thức thanh toán:</span>
              <div className="flex space-x-2">
                <div className="bg-white rounded px-2 py-1 text-primary text-xs font-bold hover:scale-110 transition-transform duration-300 shadow-md" data-testid="payment-visa">VISA</div>
                <div className="bg-white rounded px-2 py-1 text-primary text-xs font-bold hover:scale-110 transition-transform duration-300 shadow-md" data-testid="payment-momo">MOMO</div>
                <div className="bg-white rounded px-2 py-1 text-primary text-xs font-bold hover:scale-110 transition-transform duration-300 shadow-md" data-testid="payment-vnpay">VNPAY</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
