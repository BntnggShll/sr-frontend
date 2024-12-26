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
              <a href="/pekerja" className="page-scroll">
                Home
              </a>
            </li>
            <li>
              <a href="/datadocumentation" className="page-scroll">
              Documentation
              </a>
            </li>
            <li>
              <a href="/datareting" className="page-scroll">
                Rating
              </a>
            </li>
            <li>
              <a href="/datajadwalpekerja" className="page-scroll">
              Schedule
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navigation;
