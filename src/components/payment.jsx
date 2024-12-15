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

  useEffect(() => {
    if (payable_type && payable_id && amount) {
      setPayment([{ payable_type, payable_id, amount }]);
    }
  }, [payable_type, payable_id, amount]);
  useEffect(() => {
    const token = localStorage.getItem("token"); // Mengambil token dari localStorage

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
  }, [navigate]);

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

    // Membuat token kartu
    const { token, error } = await stripe.createToken(cardElement);

    if (error) {
      setErrorMessage(error.message);
    } else {
      try {
        const formData = new FormData();
        formData.append("payable_type", payable_type);
        formData.append("payable_id", payable_id);
        formData.append("user_id", user.user_id);
        formData.append("amount", amount);
        formData.append("payment_method", "Credit Card");
        formData.append("name", formData.name); // Pastikan field "name" diisi
        formData.append("stripeToken", token.id); // Sertakan token Stripe

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/stripe`,
          formData, // Kirim langsung `formData`
          {
            headers: {
              "Content-Type": "multipart/form-data", // Tambahkan header ini
            },
          }
        );

        if (response.data.success) {
          setSuccessMessage("Payment successful!");
          setFormData({ name: "" });
        } else {
          setErrorMessage(response.data.message || "Payment failed.");
        }
      } catch (error) {
        setErrorMessage("An error occurred.");
      }
    }
  };
  if (!payable_type || !payable_id || !amount) {
    return <p>Error: Missing payment details.</p>;
  }

  return (
    <div id="payment" className="container">
      <h2>
        <span>SR</span> <span>barbrshop</span>
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
                    {payment.map((payment) => (
                      <button
                        className="btn btn-primary btn-lg btn-block"
                        type="submit"
                        disabled={!stripe}
                      >
                        Pay {payment.amount}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
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
