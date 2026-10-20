// src/components/ChatBox.jsx
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

export default function ChatBox({ senderId, receiverId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const api=import.meta.env.VITE_SERVER_MAIN_URL;
  const api1=import.meta.env.VITE_SERVER_URL;


  // Initialize socket only once
  useEffect(() => {
    const newSocket = io(`${api}`);
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  // Load old messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${api1}/chat/${senderId}/${receiverId}`,
          { withCredentials: true }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, [senderId, receiverId]);

  // Join room and listen for messages
  useEffect(() => {
    if (!socket) return;

    socket.emit("joinRoom", { senderId, receiverId });

    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, senderId, receiverId]);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !socket) return;
    socket.emit("sendMessage", { senderId, receiverId, text });
    setText("");
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            No messages yet. Start the conversation!
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.senderId === senderId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                msg.senderId === senderId
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
              <div className="text-[10px] text-gray-300 mt-1 text-right">
                {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 bg-white px-4 py-3 flex items-center gap-2">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-full transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
