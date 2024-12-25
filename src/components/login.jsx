import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Perbaikan typo pada impor jwtDecode
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Fungsi untuk login
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        { email, password }
      );

      // Simpan token di Session Storage
      const token = response.data.token;
      sessionStorage.setItem("token", token);

      // Decode token dan ambil role
      const decoded = jwtDecode(token);
      const role = decoded.role;

      // Tampilkan notifikasi sukses
      toast.success("Login successful", {
        position: "top-center",
        autoClose: 3000,
        onClose: () => {
          if (role === "Admin") {
            navigate("/admin");
          } else if (role === "Pekerja") {
            navigate("/pekerja");
          } else {
            navigate("/");
          }
        },
      });
    } catch (error) {
      // Tampilkan notifikasi error
      toast.error("Login failed. Please check your email and password.", {
        position: "top-center",
        autoClose: 3000,
      });

      console.error("Login failed", error);
    }
  };

  // Periksa token di Session Storage
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded.role;

        // Arahkan berdasarkan role
        if (role === "Admin") {
          navigate("/admin");
        } else if (role === "Pekerja") {
          navigate("/pekerja");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error decoding token", error);
        sessionStorage.removeItem("token"); // Hapus token yang tidak valid
        navigate("/login"); // Arahkan ulang ke login
      }
    }
  }, [navigate]);

  return (
    <div id="login">
      <div className="container-login">
        <div className="background-login"></div>
        <img src="../img/Login.jpg" alt="Side Image" className="image-login" />

        <div className="form-section-login">
          <h1 className="login-title">Login</h1>
          <label htmlFor="email" className="input-label-login">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            className="input-box-login"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className="input-label-login">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="input-box-login"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <a href="#" className="forgot-password">
            Forgot Password
          </a>

          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>

          <div className="register-link">
            Don't have an account? <a href="/register">Register</a>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;