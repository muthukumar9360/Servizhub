import React, { useState, useEffect } from "react";
import {
    LogOut,
    Settings,
    User,
    CreditCard,
    Bell,
    Briefcase,
    Globe,
    HelpCircle,
    MessageSquare,
    Shield,
    Heart,
    Star,
    MessageCircleQuestion,
} from "lucide-react";

const SettingsSidebar = ({ isOpen, onClose }) => {
    const api = import.meta.env.VITE_SERVER_URL; // backend base URL
    const [username, setUsername] = useState("Guest");
    const [user, setUser] = useState(null);

    // --- Fetch logged-in user from backend ---
    useEffect(() => {
        if (isOpen) {
            fetch(`${api}/session/me`, { credentials: "include" })
                .then((res) => res.json())
                .then((data) => {
                    if (data.user) {
                        console.log("Logged in user data:", data.user);
                        setUsername(data.user.username || "User");
                        setUser(data.user)
                    }
                })
                .catch((err) => console.error("Error fetching session:", err));
        }
    }, [isOpen, api]);

    // --- Logout handler ---
    const handleLogout = () => {
        fetch(`${api}/session/logout`, {
            method: "POST",
            credentials: "include",
        })
            .then(() => {
                alert("Logged out successfully...");
                setUsername("Guest");
                onClose();
                setTimeout(() => {
                    window.location.href = "/JustDialPages";
                }, 500);
            })
            .catch((err) => console.error("Error logging out:", err));
    };

    // --- Sidebar items ---
    const menuItems = [
        { name: "Favorites", icon: Star, action: () => console.log("Favorites") },
        { name: "Saved", icon: Heart, action: () => console.log("Saved") },
        { name: "Edit Profile", icon: User, action: () => console.log("Edit Profile") },
        { name: "My Transactions", icon: CreditCard, action: () => console.log("My Transactions") },
        { name: "Notifications", icon: Bell, action: () => console.log("Notifications") },
        ...(user?.userType === "provider"
            ? [{ name: "My Business", icon: Briefcase, action: () => (window.location.href = `/mybusinesslist/${user._id}`) }]
            : []),
        { name: "Customer Service", icon: MessageSquare, action: () => console.log("Customer Service") },
        { name: "Investor Relations", icon: MessageCircleQuestion, action: () => console.log("Investor Relations") },
        { name: "Policy", icon: Shield, action: () => console.log("Policy") },
        { name: "Help", icon: HelpCircle, action: () => console.log("Help") },
    ];

    const listItemClasses =
        "flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition duration-150 ease-in-out cursor-pointer";

    return (
        <>
            {/* 1. Overlay */}
            <div
                className={`fixed inset-0 bg-gray-900 bg-opacity-70 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* 2. Sidebar Panel */}
            <aside
                className={`fixed top-0 right-0 w-72 sm:w-80 md:w-96 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="p-6 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* User Info Section */}
                    <div className="mt-6 flex flex-col items-center text-center">
                        <img
                            src="https://placehold.co/100x100/4F46E5/FFFFFF?text=U"
                            alt="Profile"
                            className="rounded-full w-16 h-16 mb-2"
                        />
                        <h3 className="text-lg font-semibold text-gray-800">{username}</h3>
                        <p className="text-sm text-gray-500">Click to view profile</p>
                    </div>

                    {/* Divider */}
                    <hr className="my-5 border-gray-200" />

                    {/* Menu */}
                    <nav className="flex-1 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => (
                            <div
                                key={item.name}
                                onClick={() => {
                                    item.action();
                                    onClose();
                                }}
                                className={listItemClasses}
                            >
                                <item.icon className="w-5 h-5 mr-3 text-indigo-400" />
                                {item.name}
                            </div>
                        ))}
                    </nav>

                    {/* Logout */}
                    <div className="pt-4 border-t border-gray-200 mt-auto">
                        <div
                            onClick={handleLogout}
                            className={`${listItemClasses} text-red-600 hover:bg-red-50`}
                        >
                            <LogOut className="w-5 h-5 mr-3 text-red-500" />
                            Logout
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default SettingsSidebar;
