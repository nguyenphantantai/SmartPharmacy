import { Button } from "@/components/ui/button";

export default function HeroBanner() {
  return (
    <section className="hero-gradient py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main promotional banner */}
          <div className="lg:col-span-2">
            <div className="relative bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400 rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-hidden card-hover-lift">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white rounded-full px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-semibold text-center floating-animation shadow-lg">
                <div className="text-primary">NHÀ THUỐC</div>
                <div className="text-primary">THÔNG MINH</div>
              </div>
              <div className="text-center mt-6 sm:mt-8 relative z-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 text-shadow slide-up">Gì cũng có</h1>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-red-600 mb-4 text-shadow bounce-in">Siêu deal</h2>
                <div className="bg-yellow-400 text-red-600 font-bold text-lg sm:text-xl md:text-2xl px-4 py-1 sm:px-6 sm:py-2 rounded-full inline-block mb-4 floating-animation shadow-lg">
                  GIẢM ĐẾN 10%
                </div>
              </div>
              {/* Product showcase placeholder */}
              <div className="flex justify-center items-end mt-2 sm:mt-4 space-x-1 sm:space-x-2 relative z-10">
                <div className="w-12 h-16 sm:w-16 sm:h-20 bg-white/20 rounded backdrop-blur floating-animation" style={{ animationDelay: '0s' }}></div>
                <div className="w-12 h-16 sm:w-16 sm:h-20 bg-white/20 rounded backdrop-blur floating-animation" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-12 h-16 sm:w-16 sm:h-20 bg-white/20 rounded backdrop-blur floating-animation" style={{ animationDelay: '1s' }}></div>
              </div>
              <Button
                data-testid="button-buy-now"
                className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm sm:text-base"
              >
                MUA NGAY
              </Button>
            </div>
          </div>
          
          {/* Side banners */}
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-primary rounded-xl p-4 sm:p-6 text-primary-foreground card-hover-lift slide-up">
              <h3 className="text-sm sm:text-lg font-bold mb-2 text-shadow">HƯỚNG DẪN TRA CỨU</h3>
              <h4 className="text-base sm:text-xl font-bold mb-4 text-shadow">THÔNG TIN THUỐC ĐÚNG CÁCH</h4>
              <div className="mt-4 flex items-center">
                <div className="text-2xl sm:text-3xl mr-2 sm:mr-4 floating-animation">👨‍⚕️</div>
                <Button
                  data-testid="button-learn-more"
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 text-primary-foreground hover:bg-white/30 transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
                >
                  TÌM HIỂU
                </Button>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4 sm:p-6 card-hover-lift bounce-in">
              <div className="text-primary text-xs sm:text-sm font-semibold mb-2">
                THỰC PHẨM CHỨC NĂNG CỦA THEMA
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-primary mb-4">PROBIOTICS + ZINC</h3>
              <div className="mt-4 flex items-center justify-between">
                <div className="bg-red-500 text-white font-bold text-sm sm:text-lg px-2 py-1 sm:px-3 rounded floating-animation">HOT</div>
                <div className="text-primary font-bold text-lg sm:text-xl">120.000đ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
