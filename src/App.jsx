import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HeroSection from "./HomeSections/HeroSection";
import FooterSection from "./HomeSections/FooterSection";
import CopySection from "./HomeSections/CopySection";
import RemainingSection from "./HomeSections/RemainingSection";
import PopularServices from "./HomeSections/PopularServices";
import ServicesSection from "./HomeSections/ServicesSection";
import CombinedSection from "./HomeSections/CombinedSection";
import ImageGallery from "./HomeSections/ImageGallery";
import LoginSignup from "./AuthSections/LoginSignup";
import LoginForm from "./AuthSections/LoginForm";
import SignupForm from "./AuthSections/SignupForm";
import ForgetForm from "./AuthSections/ForgetForm";
import OtpPage from "./AuthSections/OtpPage";
import ServiceInfo from "./ServiceList/ServiceInfo";
import SubcategoryInfo from "./ServiceList/SubcategoryInfo";
import OfflineToggleButton from "./Components/OfflineToggleButton";
import UserProfile from "./ServiceList/UserProfile";
import JustDialPages from "./Pages/JustDialPages";
import SubcategoryListingPage from "./JustDialHome/ServicesPages/SubCategoryListingPage";
import SubServicePage from "./JustDialHome/ServicesPages/SubServicePage";
import ChatPage from "./ChatBox/ChatPage"
import CompleteProfile from "./JustDialHome/ServicesPages/CompleteProfile";
import MyBusinessPage from "./JustDialHome/ServicesPages/MyBusinessPage";
import AddBusinessPage from "./JustDialHome/ServicesPages/AddBusinessPage";
import AllCategoriesPage from "./JustDialHome/AllCategoriesPage";
import SubCategoryList from "./JustDialHome/SubCategoryList";
import ProfileForm from "./JustDialHome/ServicesPages/ProfileForm";

function HomePage() {
  return (
    <>
      <OfflineToggleButton />
      <HeroSection />
      <ServicesSection />
      <PopularServices />
      <CopySection />
      <CombinedSection />
      <ImageGallery />
      <RemainingSection />
      <FooterSection />
    </>
  );
}

function App() {
  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/loginsignup" element={<LoginSignup />} />
          <Route path="/loginsignup/login" element={<LoginForm />} />
          <Route path="/loginsignup/signup" element={<SignupForm />} />
          <Route path="/loginsignup/forgot" element={<ForgetForm />} />
          <Route path="/loginsignup/otp" element={<OtpPage />} />
          <Route path="/services/:id" element={<ServiceInfo />} />
          <Route path="/subcategory/:subId" element={<SubcategoryInfo />} />
          <Route path="/userprofile/:userId" element={<UserProfile />} />
          <Route path="*" element={<div>404 Not Found</div>} />
          <Route path="/JustDialPages" element={<JustDialPages />} />
          <Route path="/Businesssubcategory/:id" element={<SubcategoryListingPage />}></Route>
          <Route path="/SubcategoryDetails/:id" element={<SubServicePage />}></Route>
          <Route path="/Chat/:providerId" element={<ChatPage />}></Route>
          <Route path="/justdial/completeprofile" element={<CompleteProfile/>}></Route>
          <Route path="/mybusinesslist/:userId" element={<MyBusinessPage/>} />
          <Route path="/addbusiness/:userId" element={<AddBusinessPage/>} />
          <Route path="/all-categories" element={<AllCategoriesPage />} />
          <Route path="/subcategory-list" element={<SubCategoryList />} />
          <Route path="/profile-form" element={<ProfileForm />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
