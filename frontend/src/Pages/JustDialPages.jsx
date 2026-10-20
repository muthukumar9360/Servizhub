import React, { useEffect, useState } from "react";
import OfflineToggleButton from "../Components/OfflineToggleButton";
import BusinessHeaderSection from "../JustDialHome/BusinessHeaderSection";
import BusinessShowCase from "../JustDialHome/BusinessServiceSection";
import BusinessFooterSection from "../JustDialHome/BusinessFooterSection";
import HomePageJustDial from "../JustDialHome/HomePageJustDial";
import BusinessCategory from "../JustDialHome/BusinessCategory";
import HomePageDesign from "../JustDialHome/HomePageDesign";
import LatestMoviesSection from "../JustDialHome/LatestMoviesSection";
import TouristAndSearchPage from "../JustDialHome/TouristAndSearchPage";
import ExploreSections from "../JustDialHome/ExploreSections";
import DayToDayServicesSection from "../JustDialHome/DaytoDayServicesSection";
import RecentActivitySection from "../JustDialHome/RecentActivitySection";
import RelatedArticlesSlider from "../JustDialHome/RelatedArticlesSlider";

const JustDialPages = () => {
  return (
    <>
      <OfflineToggleButton />
      <div className="w-full bg-gray-100 overflow-x-hidden">
        <BusinessHeaderSection />

        <BusinessShowCase />

        <HomePageJustDial />

        <BusinessCategory />

        <HomePageDesign />

        <section className="w-full max-w-full my-5 px-5 mb-10">
          <LatestMoviesSection />
        </section>

        <TouristAndSearchPage />

        <RecentActivitySection/>

        <section className="w-full max-w-full my-5 px-3 mb-10 bg-white -mt-2">
          <DayToDayServicesSection />
        </section>

        <section className="w-full max-w-full mb-4 bg-white -mt-10">
          <RelatedArticlesSlider/>
        </section>

        <ExploreSections />

        <BusinessFooterSection />
      </div>
    </>
  );
};

export default JustDialPages;
