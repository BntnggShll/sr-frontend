import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Reservation } from "./components/reservation";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Gallery } from "./components/gallery";
import { Rating } from "./components/rating";
import { Team } from "./components/Team";
import { Product } from "./components/product";
import Login from "./components/login";
import Register from "./components/register";
import Booking from "./components/booking";
import DataUser from "./components/DataUser";
import DataProduct from "./components/DataProduct";
import Profile from "./components/Profile";
import DataService from "./components/DataService";
import DataDocumentation from "./components/DataDokumentasi";
import DataJadwal from "./components/DataJadwal";
import DataReting from "./components/DataReting";
import DataJadwalPekerja from "./components/DataJadwalPekerja";
import DataLaporan from "./components/DataLaporan";
import DanaPaymentPage from "./components/payment";
import DataHapusReview from "./components/DataHapusReview";
import DataKeuangan from "./components/DataKeuangan";
import Detailproduk from "./components/detailproduk";
import Subscripe from "./components/Subscripe";
import Cart from "./components/cart";
import Navigationadmin from "./components/navigationadmin";
import Navigationpekerja from "./components/navigationpekerja";
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
        {/* Rute Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/booking"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <DanaPaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:productId"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <Detailproduk />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/googlepay"
          element={
            // <ProtectedRoute allowedRoles={["User"]}>
              <GooglePayPayment />
            // </ProtectedRoute>
          }
        /> */}

        {/* Rute untuk User */}
        <Route
          path="/"
          element={
            <div>
              <Navigation />
              <Header />
              <Subscripe />
              <Reservation />
              <Team />
              <Services />
              <Gallery />
              <Rating />
              <Product />
              <About />
            </div>
          }
        />

        {/* Rute untuk Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <div>
                <Navigationadmin />
                <DataKeuangan />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dataproduct"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <div>
                <Navigationadmin />
                <DataProduct />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/datauser"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <div>
                <Navigationadmin />
                <DataUser />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dataservice"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <div>
                <Navigationadmin />
                <DataService />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/datajadwal"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <div>
                <Navigationadmin />
                <DataJadwal />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/datalaporan"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <div>
                <Navigationadmin />
                <DataLaporan />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/datahapusreview"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <div>
                <Navigationadmin />
                <DataHapusReview />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Rute untuk Pekerja */}
        <Route
          path="/pekerja"
          element={
            <ProtectedRoute allowedRoles={["Pekerja"]}>
              <div>
                <Navigationpekerja />
                <Profile />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/datadocumentation"
          element={
            <ProtectedRoute allowedRoles={["Pekerja"]}>
              <div>
                <Navigationpekerja />
                <DataDocumentation />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/datareting"
          element={
            <ProtectedRoute allowedRoles={["Pekerja"]}>
              <div>
                <Navigationpekerja />
                <DataReting />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/datajadwalpekerja"
          element={
            <ProtectedRoute allowedRoles={["Pekerja"]}>
              <div>
                <Navigationpekerja />
                <DataJadwalPekerja />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
