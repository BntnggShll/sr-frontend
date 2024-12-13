import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Reservation } from "./components/reservation";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Gallery } from "./components/gallery";
import { Rating } from "./components/rating";
import { Team } from "./components/Team";
import  {Product } from "./components/product";
import  Login from "./components/login";
import Register from "./components/register";
import Booking from "./components/booking";
import DataUser from "./components/DataUser";
import DataProduct from "./components/DataProduct";
import Profile from "./components/Profile"
import DataService from "./components/DataService";
import DataDocumentation from "./components/DataDokumentasi";
import DataJadwal from "./components/DataJadwal";
import DataReting from "./components/DataReting";
import DataJadwalPekerja from "./components/DataJadwalPekerja";
import DataLaporan from "./components/DataLaporan";
import DanaPaymentPage from "./components/payment";
import DataHapusReview from "./components/DataHapusReview";
import DataKeuangan from "./components/DataKeuangan"
import Detailproduk from "./components/detailproduk";
import Subscripe from "./components/Subscripe";
import Cart from "./components/cart";
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
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/payment" element={<DanaPaymentPage/>}/>
        <Route path="/product/:productId" element={<Detailproduk/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/r" element={<Gallery/>}/>



        
        
        

        <Route
          path="/"
          element={
            <div>
              <Navigation/>
              <Header/>
              <Subscripe/>
              <Reservation />
              <Team />
              <Services/>
              <Gallery />
              <Rating />
              <Product/>
              <About />
            </div>
          }
        />
        <Route
          path="/admin"
          element={
            <div>
              <DataKeuangan/>
              <DataUser/>
              <DataProduct/>
              <DataService/>
              <DataJadwal/>
              <DataLaporan/>
              <DataHapusReview/>
            </div>
          }
        />
        <Route
          path="/pekerja"
          element={
            <div>
              <DataDocumentation/>
              <DataReting/>
              <DataJadwalPekerja/>
            </div>
          }
        />


      </Routes>
    </Router>
  );
};

export default App;
