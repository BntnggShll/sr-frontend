import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentRequestButtonElement,
  useStripe,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
);

const GooglePayPayment = () => {
  const [paymentRequest, setPaymentRequest] = useState(null);
  const stripe = useStripe();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { payable_type, payable_id, amount } = location.state || {};

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Error decoding token", error);
        navigate("/login");
      }
    } else {
      console.log("No token found");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (stripe && amount) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Total",
          amount: amount * 100, // Konversi ke sen
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });

      pr.on("paymentmethod", async (e) => {
        try {
          // Kirim data ke backend untuk menyelesaikan pembayaran
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/stripe`,
            {
              payable_type,
              payable_id,
              user_id: user.user_id,
              amount,
              payment_method: "Google Pay",
              payment_token: e.paymentMethod.id,
            }
          );

          if (response.data.success) {
            setSuccessMessage("Payment successful!");
            setTimeout(() => navigate("/"), 2000);
          } else {
            setErrorMessage(response.data.message || "Payment failed.");
          }
        } catch (error) {
          setErrorMessage("An error occurred while processing payment.");
        }
      });
    }
  }, [stripe, amount, payable_type, payable_id, user, navigate]);

  if (!payable_type || !payable_id || !amount) {
    return <p>Error: Missing payment details.</p>;
  }

  return (
    <div id="payment" className="container">
      <h2>
        <span>SR</span> <span>Barbershop</span>
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

              {paymentRequest && (
                <PaymentRequestButtonElement
                  options={{ paymentRequest }}
                  className="PaymentRequestButton"
                />
              )}
              {!paymentRequest && (
                <p>Google Pay is not available on this device/browser.</p>
              )}
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
      <GooglePayPayment />
    </Elements>
  );
}
