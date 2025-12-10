import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Pill,
  Heart,
  BarChart3,
  Stethoscope,
  Leaf,
  Flame,
  Clock,
  ClipboardList,
  Baby,
  Users,
  Sparkles,
  Gift,
  CreditCard,
  Star,
  MessageSquare,
  TrendingUp,
  Package,
  HeartPulse,
  HelpCircle,
  MapPin,
  ArrowLeft
} from "lucide-react";

export default function MoreCategoriesPage() {
  const [, setLocation] = useLocation();

  const categories = [
    // Hàng 1
    { name: "Tư vấn mua thuốc", icon: Pill, slug: "tu-van-thuoc", color: "from-blue-100 to-blue-200", route: "/tu-van-thuoc" },
    { name: "Hệ thống dược sĩ", icon: Heart, slug: "he-thong-duoc-si", color: "from-pink-100 to-pink-200", route: "/he-thong-duoc-si" },
    { name: "Mã giảm giá hàng", icon: BarChart3, slug: "ma-giam-gia", color: "from-orange-100 to-orange-200", route: "/ma-giam-gia" },
    { name: "Kiểm tra sức khỏe", icon: Stethoscope, slug: "kiem-tra-suc-khoe", color: "from-green-100 to-green-200", route: "/kiem-tra-suc-khoe" },
    
    // Hàng 2
    { name: "Chăm đẹp chuẩn", icon: Leaf, slug: "cham-dep-chuan", color: "from-purple-100 to-purple-200", route: "/cham-dep-chuan" },
    { name: "Deal hot tháng 9", icon: Flame, slug: "deal-hot-thang-9", color: "from-red-100 to-red-200", route: "/deal-hot-thang-9" },
    { name: "Lịch sử Đơn vàng", icon: Clock, slug: "lich-su-don-vang", color: "from-yellow-100 to-yellow-200", route: "/lich-su-don-vang" },
    { name: "Đơn hàng của tôi", icon: ClipboardList, slug: "don-hang-cua-toi", color: "from-blue-100 to-blue-200", route: "/account/lich-su-don-hang" },
    
    // Hàng 3
    { name: "Mẹ và bé", icon: Baby, slug: "me-va-be", color: "from-pink-100 to-pink-200", route: "/me-va-be" },
    { name: "Chăm sóc cá nhân", icon: Users, slug: "cham-soc-ca-nhan", color: "from-indigo-100 to-indigo-200", route: "/cham-soc-ca-nhan" },
    { name: "Sản phẩm mới", icon: Sparkles, slug: "san-pham-moi", color: "from-teal-100 to-teal-200", route: "/san-pham-moi" },
    { name: "Quà tặng", icon: Gift, slug: "qua-tang", color: "from-rose-100 to-rose-200", route: "/qua-tang" },
    
    // Hàng 4
    { name: "Thanh toán", icon: CreditCard, slug: "thanh-toan", color: "from-emerald-100 to-emerald-200", route: "/thanh-toan" },
    { name: "Đánh giá sản phẩm", icon: Star, slug: "danh-gia-san-pham", color: "from-amber-100 to-amber-200", route: "/danh-gia-san-pham" },
    { name: "Cộng đồng", icon: MessageSquare, slug: "cong-dong", color: "from-cyan-100 to-cyan-200", route: "/cong-dong" },
    { name: "Sản phẩm bán chạy", icon: TrendingUp, slug: "san-pham-ban-chay", color: "from-violet-100 to-violet-200", route: "/san-pham-ban-chay" },
    
    // Hàng 5
    { name: "Theo dõi đơn hàng", icon: Package, slug: "theo-doi-don-hang", color: "from-slate-100 to-slate-200", route: "/track-order" },
    { name: "Công cụ sức khỏe", icon: HeartPulse, slug: "cong-cu-suc-khoe", color: "from-red-100 to-red-200", route: "/account/cong-cu-suc-khoe" },
    { name: "Hỗ trợ", icon: HelpCircle, slug: "ho-tro", color: "from-blue-100 to-blue-200", route: "/ho-tro" },
    { name: "Hệ thống nhà thuốc", icon: MapPin, slug: "he-thong-nha-thuoc", color: "from-green-100 to-green-200", route: "/he-thong-nha-thuoc" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header với nút quay lại */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="p-2 hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Xem thêm</h1>
        </div>

        {/* Grid 4 cột */}
        <div className="grid grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.slug} href={category.route}>
                <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group bg-white border border-gray-200">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                    <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-foreground" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors leading-tight">
                    {category.name}
                  </h3>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}

