import { Header } from "@/components/header";
import HeroBanner from "@/components/hero-banner";
import CategoryNavigation from "@/components/category-navigation";
import DealHuntSection from "@/components/deal-hunt-section";
import ProductGrid from "@/components/product-grid";
import HotDealsSection from "@/components/hot-deals-section";
import TopSellingSection from "@/components/top-selling-section";
import PromotionalBanners from "@/components/promotional-banners";
import { Footer } from "@/components/footer";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="bg-background min-h-screen smooth-scroll">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <HeroBanner />
      <div id="categories">
        <CategoryNavigation />
      </div>
      
      <DealHuntSection />
      <ProductGrid />
      <HotDealsSection />
      <TopSellingSection />
      <PromotionalBanners />
      <Footer />
      
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          data-testid="button-chat"
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 floating-animation neon-glow focus-visible"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
