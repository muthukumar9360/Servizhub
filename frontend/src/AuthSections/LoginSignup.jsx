import React, { useState, useEffect, useRef } from "react";
import sampleImg from "./assets/image1.png";
import bgImg from "./assets/image.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SocialButton = ({ onClick, icon, text }) => (
  <button
    onClick={onClick}
    type="button"
    className="w-full border border-gray-300 py-2 rounded flex items-center justify-center hover:bg-gray-100 transition duration-200 text-sm sm:text-base"
  >
    <img src={icon} alt={text} className="mr-2 w-5 h-5 sm:w-6 sm:h-6" />
    {text}
  </button>
);

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [prefill, setPrefill] = useState({});
  const alertShown = useRef(false);
  const api = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);

  const getLinkWithQuery = (isLoginPage) => {
    const basePath = isLoginPage ? "/loginsignup/login" : "/loginsignup/signup";
    const filteredQuery = new URLSearchParams();
    if (query.get("chat")) filteredQuery.set("chat", query.get("chat"));
    if (query.get("providerId")) filteredQuery.set("providerId", query.get("providerId"));
    if (query.get("offline")) filteredQuery.set("offline", query.get("offline"));
    const queryString = filteredQuery.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");

    if (!alertShown.current) {
      if (error === "account_exists") {
        alert("⚠️ Account already exists, please login.");
        setIsLogin(true);
        alertShown.current = true;
      } else if (error === "not_registered") {
        alert("⚠️ Account not registered. Please sign up first.");
        setIsLogin(false);
        alertShown.current = true;
      } else if (error === "server_error") {
        alert("⚠️ Server error. Try again later.");
        alertShown.current = true;
      }
    }

    const email = params.get("email");
    const googleId = params.get("googleId");
    const firstname = params.get("firstname");
    const lastname = params.get("lastname");

    if (email && googleId) {
      setPrefill({ email, googleId, firstname, lastname });
      setIsLogin(false);
    }
  }, [location]);

  const handleGoogleClick = (type) => {
    const base = `${api}/auth/google`;
    window.location.href = type === "signup" ? `${base}/signup` : `${base}/login`;
  };

  return (
    <div
      className="flex flex-col md:flex-row min-h-screen items-center justify-center bg-gray-100 bg-cover bg-center p-4 lg:p-6"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-lg shadow-lg overflow-hidden border border-gray-200 bg-white/80 backdrop-blur-sm">
        
        {/* Left Panel */}
        <div className="w-full md:w-1/2 bg-[#7B2D43] text-white pt-1 pb-4 lg:p-10 flex flex-col justify-between items-center md:items-start text-center md:text-left">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-1 lg:mb-6">Success starts here</h2>
            <ul className="lg:space-y-2 text-xs">
              <li>✓ Over 700 categories</li>
              <li>✓ Quality work done faster</li>
              <li>✓ Access to global talent & businesses</li>
            </ul>
          </div>
          <img
            src={sampleImg}
            alt="Work illustration"
            className="rounded-lg mt-3 lg:mt-6 w-full px-4 lg:px-0"
          />
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 px-6 pt-2.5 pb-2 lg:pt-6 lg:py-6 lg:p-10 bg-white">
          <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-2 lg:mb-6 underline">
            {isLogin ? "Login Page" : "Signup Page"}
          </h1>

          <h2 className="text-lg lg:text-2xl font-semibold mb-1 lg:mb-4">
            {isLogin ? "Sign in into your account" : "Create a new account"}
          </h2>

          <p className="text-sm lg:mb-6 mb-3">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 hover:underline"
                >
                  Join Here
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>

          {/* Social Buttons */}
          <div>
            <div className="space-y-1 lg:space-y-4">
              <button
                type="button"
                className="w-full border border-gray-300 py-2 rounded flex items-center justify-center hover:bg-gray-100 text-sm sm:text-base"
                onClick={() => handleGoogleClick(isLogin ? "login" : "signup")}
              >
                <img
                  src="https://img.icons8.com/color/24/google-logo.png"
                  alt="google"
                  className="mr-2 w-5 h-5 sm:w-6 sm:h-6"
                />
                Continue with Google
              </button>
            </div>
            <Link to={getLinkWithQuery(isLogin)}>
              <button className="w-full border border-gray-300 py-2 rounded flex items-center justify-center hover:bg-gray-100 mt-2 lg:mt-5 text-sm sm:text-base">
                <img
                  src="https://img.icons8.com/color/24/email.png"
                  alt="email"
                  className="mr-2 w-5 h-5 sm:w-6 sm:h-6"
                />
                Continue with Email
              </button>
            </Link>
          </div>

          {/* Divider */}
          <div className="flex items-center my-0 lg:my-6">
            <div className="border-t w-full"></div>
            <span className="px-4 text-gray-500 text-sm sm:text-base">or</span>
            <div className="border-t w-full"></div>
          </div>

          {/* Apple + Facebook */}
          <div className="grid grid-cols-2 gap-4">
            <SocialButton
              icon="https://img.icons8.com/ios-filled/24/mac-os.png"
              text="Apple"
            />
            <SocialButton
              icon="https://img.icons8.com/fluency/24/facebook-new.png"
              text="Facebook"
            />
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-500 mt-3 lg:mt-6 text-center md:text-left">
            By joining, you agree to the{" "}
            <a href="#" className="text-blue-700 underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-700 underline">
              Privacy Policy
            </a>
            .
          </p>

          {/* Close */}
          <div className="text-center">
            <button
              onClick={() => navigate(-1)}
              className="mt-2 lg:mt-6 px-6 py-2 bg-[#7B2D43] text-white rounded-lg hover:bg-red-500 transition duration-300 shadow-md text-sm lg:text-base"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
