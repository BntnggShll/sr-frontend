import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

// Load Stripe.js
const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`);

const StripePayment = () => {
  const [formData, setFormData] = useState({
    name: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const stripe = useStripe();
  const elements = useElements();

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
        // Mengirim token kartu ke backend
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/stripe`,
          {
            name: formData.name,
            stripeToken: token.id,
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

  return (
    <div className="container">
      <h1>Stripe Payment Gateway Integration</h1>

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
                    <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={!stripe}>
                      Pay Now ($100)
                    </button>
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
