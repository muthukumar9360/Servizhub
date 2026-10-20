import React from "react";
import EquipmentRentalHeaderSection from "../../JustDialHome/EquipmentRentalHeaderSection";
import EquipmentHeroSection from "../../HomeSections/EquipmentHeroSection";
import EquipmentCategoriesSection from "../../HomeSections/EquipmentCategoriesSection";
import PopularEquipmentRentalsSection from "../../HomeSections/PopularEquipmentRentalsSection";
import ExploreEquipmentSections from "../../JustDialHome/ExploreEquipmentSections";
import RecentRentalActivitySection from "../../JustDialHome/RecentRentalActivitySection";
import DailyEquipmentRentalSection from "../../JustDialHome/DailyEquipmentRentalSection";
import TrendingEquipmentSearchesSection from "../../JustDialHome/TrendingEquipmentSearchesSection";
import EquipmentProBannersSection from "../../HomeSections/EquipmentProBannersSection";
import EquipmentGuidesSection from "../../HomeSections/EquipmentGuidesSection";
import EquipmentSuccessSection from "../../HomeSections/EquipmentSuccessSection";
import ImageGallery from "../../HomeSections/ImageGallery";
import EquipmentFooterSection from "../../HomeSections/EquipmentFooterSection";

const LandingPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* 1. Servizio Equipment Depot Header with City & Voice Search */}
      <EquipmentRentalHeaderSection />

      {/* 2. Full Video Hero & Search Header */}
      <EquipmentHeroSection />

      {/* 3. Category Grid */}
      <EquipmentCategoriesSection />

      {/* 4. Popular Rentals Swiper Carousel */}
      <PopularEquipmentRentalsSection />

      {/* 5. Explore 25 Equipment Categories Directory */}
      <ExploreEquipmentSections />

      {/* 6. Trending Searches HOT Carousel */}
      <TrendingEquipmentSearchesSection />

      {/* 7. Recent Rental Activity & Depot Reviews */}
      <RecentRentalActivitySection />

      {/* 8. Day-to-Day Equipment Rental Advantages */}
      <DailyEquipmentRentalSection />

      {/* 9. Equipora Pro Banners */}
      <EquipmentProBannersSection />

      {/* 10. Equipment Rental Guides */}
      <EquipmentGuidesSection />

      {/* 11. Verified Success Metrics */}
      <EquipmentSuccessSection />

      {/* 12. Equipment Photo Gallery Showcase */}
      <ImageGallery />

      {/* 13. Full Equipment Footer */}
      <EquipmentFooterSection />
    </div>
  );
};

export default LandingPage;
