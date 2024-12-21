import {jwtDecode} from "jwt-decode"; // Import jwtDecode tanpa {}
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  // Ambil token dari localStorage
  const token = sessionStorage.getItem("token");

  if (!token) {
    // Redirect ke login jika token tidak ditemukan
    return <Navigate to="/login" />;
  }

  try {
    // Decode token untuk mendapatkan role
    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;

    if (!allowedRoles.includes(role)) {
      return <Navigate to="/login" />;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    // Redirect ke login jika token tidak valid
    return <Navigate to="/login" />;
  }

  // Render anak komponen jika role sesuai
  return children;
}

export default ProtectedRoute;
