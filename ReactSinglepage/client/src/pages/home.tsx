import { Header } from "@/components/header";
import HeroBanner from "@/components/hero-banner";
import CategoryNavigation from "@/components/category-navigation";
import DealHuntSection from "@/components/deal-hunt-section";
import ProductGrid from "@/components/product-grid";
import HotDealsSection from "@/components/hot-deals-section";
import TopSellingSection from "@/components/top-selling-section";
import PromotionalBanners from "@/components/promotional-banners";
import { Footer } from "@/components/footer";
import { AIChat } from "@/components/ai-chat";
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
      
      {/* AI Chat Component */}
      <AIChat />
    </div>
  );
}
