import React, { useState } from "react";
import axios from "axios";

export default function Payment() {
  const [amount, setAmount] = useState("500"); // default ₹500
  const [msg, setMsg] = useState("");

  const api=import.meta.env.VITE_SERVER_URL;


  const handlePayment = async () => {
    setMsg("");

    try {
      // 1️⃣ Create test order (backend must return { order, key })
      const resp = await axios.post(
        `${api}/payment/create-order`,
        { amount },
        { headers: { "Content-Type": "application/json" } }
      );

      const { order, key } = resp.data;
      if (!order) return setMsg("⚠️ Failed to create order.");

      // 2️⃣ Razorpay Checkout Options
      const options = {
        key: key || "rzp_test_RSdArGEUMuy9EL", // fallback test key
        amount: order.amount,
        currency: order.currency,
        name: "AutoHub - Test Mode",
        description: "Simulated UPI / Card / Wallet Payment",
        order_id: order.id,

        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },

        // ✅ Enable all methods in test mode
        method: {
          card: true,
          netbanking: true,
          wallet: true,
          upi: true,
          qr: true,
          paylater: true,
        },

        // ✅ Force UPI collect flow (use test VPA)
        upi: {
          flow: "collect",
          vpa: "test@upi",
        },

        handler: function (response) {
          console.log("Payment success (test mode):", response);
          alert("✅ Simulated payment success!\nPayment ID: " + response.razorpay_payment_id);
        },

        modal: {
          ondismiss: function () {
            console.log("Razorpay Checkout closed.");
          },
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment Error:", err);
      setMsg("❌ Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div
      style={{
        padding: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h2>🧾 Simulate Razorpay UPI Payment (Test Mode)</h2>
      <div style={{ margin: "10px 0" }}>
        <label>Amount (₹): </label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: "100px", padding: "5px", marginLeft: "5px" }}
        />
      </div>
      <button
        onClick={handlePayment}
        style={{
          padding: "10px 20px",
          backgroundColor: "#3399cc",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Pay ₹{amount}
      </button>
      {msg && <p style={{ color: "red", marginTop: "15px" }}>{msg}</p>}
      <p style={{ marginTop: "20px", fontSize: "14px", color: "#555" }}>
        Use test VPA: <b>test@upi</b> or <b>user@upi</b>
      </p>
    </div>
  );
}
