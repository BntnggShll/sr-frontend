import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css'; // Pastikan Anda mengimpor stylesheet

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { email, password });
      
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      // Menampilkan notifikasi jika login gagal
      toast.error("Login failed. Please check your email and password.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Login failed", error);
    }
  };

  return (
    <div id="login">
      <div className="container-login">
        <div className="background-login"></div>
        <img src="../img/Login.jpg" alt="Side Image" className="image-login" />

        <div className="form-section-login">
          <h1 className="login-title">Login</h1>

          <label htmlFor="email" className="input-label-login">Your Email</label>
          <input
            type="email"
            id="email"
            className="input-box-login"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required // Menandai field ini sebagai required
          />

          <label htmlFor="password" className="input-label-login">Password</label>
          <input
            type="password"
            id="password"
            className="input-box-login"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required // Menandai field ini sebagai required
          />
          <a href="#" className="forgot-password">Forgot Password</a>

          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>

          <div className="register-link">
            Don't have an account? <a href="/register">Register</a>
          </div>
          {/* <a href="http://127.0.0.1:8000/api/auth/google" className="btn btn-primary">aa</a> */}
        </div>
      </div>
      <ToastContainer /> 
    </div>
  );
};

export default Login;
