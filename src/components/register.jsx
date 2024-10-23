import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhone] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/register`,
        { name, email, password, phone_number }
      );

      localStorage.setItem("user", response.data.user);
      navigate("/");
    } catch (error) {
      toast.error("Register failed!!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Failed", error);
    }
  };

  return (
    <div className="register-container">
      <div className="background-image-register"></div>
      <img
        src="../img/register.jpg"
        alt="Side Image"
        className="image-register"
      />

      <div className="form-section-register">
        <h1 className="register-title">Register</h1>

        <label htmlFor="name" className="input-label-register">
          Name
        </label>
        <input
          type="text"
          id="name"
          className="input-box-register"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="email" className="input-label-register">
          Your Email
        </label>
        <input
          type="email"
          id="email"
          className="input-box-register"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password" className="input-label-register">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="input-box-register"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="phone" className="input-label-register">
          Phone Number
        </label>
        <input
          type="text"
          id="phone"
          className="input-box-register"
          style={{ marginBottom: 30 }}
          value={phone_number}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <button className="register-btn" onClick={handleRegister}>Register</button>

        <div className="login-link">
          Already have an account? <a href="/login">Sign In</a>
        </div>
      </div>
      <ToastContainer /> 
    </div>
  );
};

export default Register;
