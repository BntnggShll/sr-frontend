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
              <a href="/admin" className="page-scroll">
              Finance
              </a>
            </li>
            <li>
              <a href="/datauser" className="page-scroll">
              User And Worker
              </a>
            </li>
            <li>
              <a href="/dataproduct" className="page-scroll">
              Product
              </a>
            </li>
            <li>
              <a href="/dataservice" className="page-scroll">
              Service
              </a>
            </li>
            <li>
              <a href="/datajadwal" className="page-scroll">
              Schedule
              </a>
            </li>
            <li>
              <a href="/datalaporan" className="page-scroll">
              Reservation
              </a>
            </li>
            <li>
              <a href="/datahapusreview" className="page-scroll">
              Review
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navigation;
