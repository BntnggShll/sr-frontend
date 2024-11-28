import React, { useState } from "react";
import axios from "axios";

function DanaPaymentPage() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  const handlePayment = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/create-dana-payment`, {
        phone: phone,
        email: "user@example.com", // Email dummy
        amount: amount,
      });

      if (response.data.status_code === "201") {
        alert("Silakan selesaikan pembayaran di aplikasi DANA Anda!");
      } else {
        alert("Pembayaran gagal: " + response.data.status_message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat memproses pembayaran.");
    }
  };

  return (
    <div>
      <h1>Pembayaran DANA</h1>
      <input
        type="text"
        placeholder="Nomor HP DANA"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="number"
        placeholder="Jumlah Pembayaran"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handlePayment}>Bayar Sekarang</button>
    </div>
  );
}

export default DanaPaymentPage;
