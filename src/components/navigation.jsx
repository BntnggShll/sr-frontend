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
            <img
              src="../img/LogoSR.png"
              alt="Logo"
              style={{ height: "45px" }}
            />
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
              <a href="#testimonials" className="page-scroll">
              Rating
              </a>
            </li>
            <li>
              <a href="#about" className="page-scroll">
              Poin
              </a>
            </li>
            <li>
              <a href="#contact" className="page-scroll">
              Product
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navigation;