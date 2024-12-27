import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";

// Load Stripe.js
const stripePromise = loadStripe(
  `${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`
);

const StripePayment = () => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null); // State untuk menangani error
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const [payment, setPayment] = useState([]);

  const { payable_type, payable_id, amount } = location.state || {};

  // useEffect(() => {
  //   if (payable_type && payable_id && amount) {
  //     setPayment([{ payable_type, payable_id, amount }]);
  //   }
  // }, [payable_type, payable_id, amount]);

  useEffect(() => {
    if (payable_type && payable_id && amount) {
      // Pastikan data diterima dalam bentuk array
      const paymentData = payable_id.map((id, index) => ({
        payable_type,
        payable_id: id,
        amount: amount[index],
      }));
      setPayment(paymentData);
    }
  }, [payable_type, payable_id, amount]);

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Mengambil token dari sessionStorage

    if (token) {
      try {
        const decoded = jwtDecode(token); // Mendekode token
        setUser(decoded); // Menyimpan hasil dekode ke state user
      } catch (error) {
        console.error("Error decoding token", error);
        setError("Invalid token format or missing parts."); // Menangani error
        navigate("/login"); // Navigasi ke login jika token tidak valid
      }
    } else {
      console.log("No token found");
      navigate("/login"); // Navigasi ke login jika tidak ada token
    }
  }, [navigate]); // Menambahkan navigate sebagai dependensi

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      setErrorMessage("Please fill your name.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setErrorMessage("Card details are incomplete.");
      return;
    }

    
    if (error) {
      setErrorMessage(error.message);
    } else {

      try {
        // Proses pembayaran menggunakan token unik untuk setiap transaksi
        const paymentResults = await Promise.all(
          payment.map(async (paymentItem) => {
            // Buat token Stripe untuk transaksi ini
            const { token, error } = await stripe.createToken(cardElement);
            if (error) {
              throw new Error(`Failed to create token for payable_id ${paymentItem.payable_id}: ${error.message}`);
            }
      
            // Siapkan data untuk API backend
            const formData = {
              payments: [
                {
                  payable_type: paymentItem.payable_type,
                  payable_id: paymentItem.payable_id,
                  user_id: user.user_id,
                  amount: paymentItem.amount,
                  payment_method: "Credit Card",
                },
              ],
              stripeToken: token.id, // Token unik
            };
      
            // Kirim permintaan ke backend
            try {
              const response = await axios.post(`${process.env.REACT_APP_API_URL}/stripe`, formData, {
                headers: { "Content-Type": "application/json" },
              });
              return response.data[0]; // Ambil hasil dari respons array backend
            } catch (apiError) {
              return {
                success: false,
                message: apiError.message || "Failed to connect to the payment server.",
                payable_id: paymentItem.payable_id,
              };
            }
          })
        );
      
        // Periksa hasil pembayaran
        const failedPayments = paymentResults.filter((res) => !res.success);
      
        if (failedPayments.length === 0) {
          // Semua pembayaran berhasil
          toast.success("All payments were successful!", {
            position: "top-center",
            autoClose: 2000,
            onClose: () => navigate("/"),
          });
        } else {
          // Beberapa pembayaran gagal
          const failedMessages = failedPayments
            .map((payment) => `Payable ID ${payment.payable_id}: ${payment.message}`)
            .join("\n");
      
          console.error("Some payments failed:", failedMessages);
          toast.error(`${failedPayments.length} payment(s) failed:\n${failedMessages}`, {
            position: "top-center",
            autoClose: 4000,
          });
        }
      } catch (error) {
        console.error("Error occurred during the payment process:", error);
        toast.error("An error occurred during the payment process. Please try again.", {
          position: "top-center",
          autoClose: 4000,
        });
      }
    }
  };
  if (!payable_type || !payable_id || !amount) {
    return (
      <p
        style={{ display: "flex", justifyContent: "center", marginTop: "20%" }}
      >
        Error: Missing payment details.
      </p>
    );
  }

  const totalAmount = payment.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div id="payment" className="container">
      <h2>
        <span>SR</span> <span>barbershop</span>
      </h2>

      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <div className="panel panel-default credit-card-box">
            <div className="panel-heading">
              <h3 className="panel-title">Payment Details</h3>
            </div>
            <div className="panel-body">
              {errorMessage && (
                <div className="alert alert-danger">
                  <p>{errorMessage}</p>
                </div>
              )}
              {successMessage && (
                <div className="alert alert-success">
                  <p>{successMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="require-validation">
                <div className="form-row row">
                  <div className="col-xs-12 form-group required">
                    <label className="control-label">Name on Card</label>
                    <input
                      className="form-control"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row row">
                  <div className="col-xs-12 form-group required">
                    <label className="control-label">Card Details</label>
                    <CardElement />
                  </div>
                </div>

                <div className="row">
                  <div className="col-xs-12">
                    <button
                      className="btn btn-primary btn-lg btn-block"
                      type="submit"
                      disabled={!stripe}
                    >
                      Pay {totalAmount}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default function PaymentWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <StripePayment />
    </Elements>
  );
}
