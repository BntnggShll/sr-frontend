import React from "react";

export const Header = (props) => {
  return (
    <header id="header">
      <div className="intro" >
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
                {/* Memindahkan elemen teks ke dalam intro-text */}
                <h1>
                  SR
                  <span></span>
                </h1>
                <h1>
                  Barbershop
                  <span></span>
                </h1>
                <a
                  href="/booking"
                  className="btn btn-custom btn-lg page-scroll" style={{paddingRight:30,paddingLeft:30}}
                >
                  Book
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
