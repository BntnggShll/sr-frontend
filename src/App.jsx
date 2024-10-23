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
import  {Product } from "./components/product";
import Poin  from "./components/poin";
import  Login from "./components/login";
import Register from "./components/register";
import Booking from "./components/booking";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/booking" element={<Booking/>}/>

        <Route
          path="/"
          element={
            <div>
              <Navigation/>
              <Header/>
              <Features />
              <Team />
              <Services  />
              <Gallery />
              <Testimonials />
              <Poin/>
              <Product/>
              <About />
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
