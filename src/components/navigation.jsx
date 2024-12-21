import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Navigation = (props) => {
  const [user, setUser] = useState(null); // Menggunakan null sebagai nilai awal
  const [error, setError] = useState(null); // State untuk menangani error
  const navigate = useNavigate(); // Inisialisasi navigate

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Mengambil token dari sessionStorage

    if (token) {
      try {
        const decoded = jwtDecode(token); // Mendekode token
        setUser(decoded); // Menyimpan hasil dekode ke state user
      } catch (error) {
        console.error("Error decoding token", error);
        setError("Invalid token format or missing parts."); // Menangani error
        sessionStorage.removeItem("token"); // Menghapus token yang tidak valid
        navigate("/login"); // Arahkan ke halaman login jika token tidak valid
      }
    }
  }, [navigate]); // Tambahkan navigate ke dependency array

  if (error) {
    return <div>{error}</div>; // Menampilkan pesan error jika ada
  }

  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <a href="#page-top">
            <img src="../img/LogoSR.png" alt="Logo" className="logo" />
          </a>
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav ms-autonavbar-nav me-auto mb-2 mb-lg-0">
            <li>
              <a href="#reservation" className="page-scroll">
                Home
              </a>
            </li>
            <li>
              <a href="#subscripe" className="page-scroll">
                Subscribe
              </a>
            </li>
            <li>
              <a href="#team" className="page-scroll">
                Barberman
              </a>
            </li>
            <li>
              <a href="#services" className="page-scroll">
                Services
              </a>
            </li>
            <li>
              <a href="#galery" className="page-scroll">
                Gallery
              </a>
            </li>
            <li>
              <a href="#rating" className="page-scroll">
                Rating
              </a>
            </li>
            <li>
              <a href="#product" className="page-scroll">
                Product
              </a>
            </li>
            <li>
              <a href="#about" className="page-scroll">
                About
              </a>
            </li>
          </ul>
          <ul className="nav navbar-nav ms-autonavbar-nav me-auto mb-2 mb-lg-0">
            <li class="dropdown">
              {user ? (
                <a href="/profile" className="dropbtn">
                  {"Profile"}
                </a>
              ) : (
                <a href="/login" className="dropbtn">
                  Login
                </a>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navigation;
