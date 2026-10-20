import React, { useEffect, useState } from "react";
import OfflineToggleButton from "../Components/OfflineToggleButton";
import EquipmentRentalHeaderSection from "../JustDialHome/EquipmentRentalHeaderSection";
import EquipmentRentalShowcaseSection from "../JustDialHome/EquipmentRentalShowcaseSection";
import BusinessFooterSection from "../JustDialHome/BusinessFooterSection";
import HomePageJustDial from "../JustDialHome/HomePageJustDial";
import EquipmentDepotCategorySection from "../JustDialHome/EquipmentDepotCategorySection";
import HomePageDesign from "../JustDialHome/HomePageDesign";
import LatestMoviesSection from "../JustDialHome/LatestMoviesSection";
import TouristAndSearchPage from "../JustDialHome/TouristAndSearchPage";
import ExploreEquipmentSections from "../JustDialHome/ExploreEquipmentSections";
import DailyEquipmentRentalSection from "../JustDialHome/DailyEquipmentRentalSection";
import RecentRentalActivitySection from "../JustDialHome/RecentRentalActivitySection";
import RelatedArticlesSlider from "../JustDialHome/RelatedArticlesSlider";

const EquipmentDepotsDirectoryPage = () => {
  return (
    <>
      <OfflineToggleButton />
      <div className="w-full bg-gray-100 overflow-x-hidden">
        <EquipmentRentalHeaderSection />

        <EquipmentRentalShowcaseSection />

        <HomePageJustDial />

        <EquipmentDepotCategorySection />

        <HomePageDesign />

        <section className="w-full max-w-full my-5 px-5 mb-10">
          <LatestMoviesSection />
        </section>

        <TouristAndSearchPage />

        <RecentRentalActivitySection />

        <section className="w-full max-w-full my-5 px-3 mb-10 bg-white -mt-2">
          <DailyEquipmentRentalSection />
        </section>

        <section className="w-full max-w-full mb-4 bg-white -mt-10">
          <RelatedArticlesSlider />
        </section>

        <ExploreEquipmentSections />

        <BusinessFooterSection />
      </div>
    </>
  );
};

export default EquipmentDepotsDirectoryPage;
