import React from "react";

export const About = (props) => {
  return (
    <div>
      <div id="about">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-6"> </div>
            <div className="col-xs-12 col-md-6">
              <div className="about-text">
                <h2 style={{marginTop:"-90px"}}>
                  <span>About</span>
                  <span>Us</span>
                </h2>
                <p>
                  Haaii !! Untuk yang mau cukur atau service lainnya Booking
                  harus 2 jam sebelum waktu yang di tentukan dan untuk
                  pembatalan juga 2 jam sebelum waktu yang telah di tentukan,
                  hubungi 085213742275 ,terimaksih untuk perhatiannya 🙌😆z
                </p>
                <div style={{ marginTop: "20px" }}>
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7747089660998!2d100.3910769!3d-0.267893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd547458154bf0b%3A0x5ce5e9e69f0096de!2sSr%20Cukur%20Kepala!5e0!3m2!1sid!2sid!4v1734795119287!5m2!1sid!2sid" width="600" height="300" style={{border:"0"}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
                <div className="list-style">
                  <div className="col-lg-6 col-sm-6 col-xs-12"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="footer">
        <div className="container text-center">
          <p>
            &copy; 2024 Design by <p style={{ color: "blue" }}>Kelompok 5</p>
          </p>
        </div>
      </div>
    </div>
  );
};
