import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatBox from "./ChatBox";
import TopBanner from "../Components/TopBanner";

export default function ChatPage() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const api=import.meta.env.VITE_SERVER_URL;


  useEffect(() => {
    fetch(`${api}/session/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          console.log("User session found:", data.user);
          console.log("Provider ID from URL:", providerId);
          setUserId(data.user._id);
        } else {
          setShowBanner(true); // show custom banner
          setTimeout(() => navigate(`/loginsignup?chat=true&&providerId=${providerId}`), 2000);
        }
      })
      .catch((err) => {
        console.error("Error fetching session:", err);
        setShowBanner(true);
        setTimeout(() => navigate(`/loginsignup?error=${err}`), 2000);
      });
  }, [navigate]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {showBanner && (
        <TopBanner
          message="⚠️ Please log in first to use the chat feature"
          duration={2000}
          onClose={() => setShowBanner(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-indigo-600 text-white shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm font-medium hover:text-gray-200 transition"
        >
          ← Back
        </button>

        <h2 className="text-lg font-semibold">💬 Chat Room</h2>

        <div className="text-sm text-gray-200">
          {userId && providerId ? (
            <>
              <span className="font-medium text-white">
                User ({userId.slice(-5)})
              </span>{" "}
              ↔{" "}
              <span className="font-medium text-white">
                Provider ({providerId.slice(-5)})
              </span>
            </>
          ) : (
            "Loading..."
          )}
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col justify-between bg-gray-50 overflow-hidden">
        {userId && providerId ? (
          <div className="flex-1 overflow-y-auto p-4">
            <ChatBox senderId={userId} receiverId={providerId} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Loading chat...
          </div>
        )}
      </div>
    </div>
  );
}
