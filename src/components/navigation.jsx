import React from "react";

export const Navigation = (props) => {
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
              <a href="#features" className="page-scroll">
                Home
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
              <a href="#poin" className="page-scroll">
                Poin
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
              <a href="/profile" class="dropbtn">
                Profile
              </a>
              <div class="dropdown-content">
                <a href="/login">login</a>
                <a href="#">Link 2</a>
                <a href="#">Link 3</a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navigation;
