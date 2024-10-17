import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Gallery } from "./components/gallery";
import { Testimonials } from "./components/testimonials";
import { Team } from "./components/Team";
import { Contact } from "./components/contact";
import  Login from "./components/login";
import Register from "./components/register";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Route untuk halaman login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>}/>

        {/* Route untuk halaman utama yang memiliki navigasi */}
        <Route
          path="/"
          element={
            <div>
              <Navigation />
              <Header data={landingPageData.Header} />
              <Features data={landingPageData.Features} />
              <Team data={landingPageData.Team} />
              <Services data={landingPageData.Services} />
              <Gallery data={landingPageData.Gallery} />
              <Testimonials data={landingPageData.Testimonials} />
              <About data={landingPageData.About} />
              <Contact data={landingPageData.Contact} />
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
