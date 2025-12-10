import { Link } from "wouter";

export default function CategoryNavigation() {
  const categories = [
    { name: "Tư vấn mua thuốc", icon: "💊", slug: "tu-van-thuoc" },
    { name: "Hệ thống dược sĩ", icon: "❤️", slug: "he-thong-duoc-si" },
    { name: "Mã giảm giá hàng", icon: "📊", slug: "ma-giam-gia" },
    { name: "Kiểm tra sức khỏe", icon: "🚚", slug: "kiem-tra-suc-khoe" },
    { name: "Chăm đẹp chuẩn", icon: "🌿", slug: "cham-dep-chuan" },
  ];

  return (
    <section className="bg-background py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
          {categories.map((category, index) => {
            // Map slug to actual route
            const getRoute = (slug: string) => {
              return `/${slug}`;
            };

            return (
            <Link 
              key={category.slug} 
              href={getRoute(category.slug)} 
              className="text-center category-icon cursor-pointer fade-in" 
              data-testid={`category-${category.slug}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`rounded-xl p-2 sm:p-3 md:p-4 mb-1 sm:mb-2 mx-auto w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg ${
                  category.slug === "tu-van-mua-thuoc"
                    ? "bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300"
                    : category.slug === "he-thong-duoc-si"
                    ? "bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300"
                    : category.slug === "ma-giam-gia"
                    ? "bg-gradient-to-br from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300"
                    : category.slug === "chi-tiet-suc-khoe"
                    ? "bg-gradient-to-br from-red-100 to-red-200 hover:from-red-200 hover:to-red-300"
                    : category.slug === "cham-dep-chuan"
                    ? "bg-gradient-to-br from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300"
                    : "bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300"
                }`}
              >
                <span className="text-lg sm:text-xl md:text-2xl transition-transform duration-300 hover:scale-110">{category.icon}</span>
              </div>
              <span className="text-xs sm:text-sm font-medium transition-colors duration-300 hover:text-primary leading-tight">{category.name}</span>
            </Link>
            );
          })}
          
          {/* Nút Xem thêm - Style khác biệt */}
          <Link 
            href="/xem-them"
            className="text-center category-icon cursor-pointer fade-in ml-2 sm:ml-4"
            data-testid="category-xem-them"
            style={{ animationDelay: `${categories.length * 0.1}s` }}
          >
            <div className="rounded-xl p-2 sm:p-3 md:p-4 mb-1 sm:mb-2 mx-auto w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center transition-all duration-300 border-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/5 bg-transparent">
              <span className="text-lg sm:text-xl md:text-2xl transition-transform duration-300 hover:scale-110">➡️</span>
            </div>
            <span className="text-xs sm:text-sm font-medium transition-colors duration-300 hover:text-primary leading-tight text-primary">Xem thêm</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
