import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"; // Pastikan Anda mengimpor stylesheet
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        { email, password }
      );

      // Menyimpan token dan menampilkan notifikasi sukses
      localStorage.setItem("token", response.data.token);
      toast.success("Login Success", {
        position: "top-center",
        autoClose: 3000,
        onClose: () => {
          console.log(user.role);
          if (user.role === "Admin") {
            navigate("/admin");
          }
          if (user.role === "Pekerja") {
            navigate("/pekerja");
          }
          if (user.role === "User") {
            navigate("/");
          }
        },
      });
    } catch (error) {
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
            required // Menandai field ini sebagai required
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
            required // Menandai field ini sebagai required
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
          {/* <a href="http://127.0.0.1:8000/api/auth/google" className="btn btn-primary">aa</a> */}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
