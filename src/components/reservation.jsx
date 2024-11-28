import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Perbaikan impor
import { useNavigate } from "react-router-dom";

export const Reservation = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // Menyimpan data user
      } catch (error) {
        console.error("Error decoding token", error);
        setError("Invalid token format or missing parts.");
      }
    }
  }, [navigate]);


  useEffect(() => {
    const storedReservations = localStorage.getItem("reservations");
    if (storedReservations) {
      try {
        const parsedReservations = JSON.parse(storedReservations);
        setReservations(parsedReservations);
      } catch (error) {
        console.error("Error parsing reservations from localStorage", error);
        setError("Failed to load reservations.");
      }
    }
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div id="reservation">
      <h2>Reservasi</h2>
      <div className="container">
        <h1>Status Reservasi</h1>
        <div className="reservations-scrollable">
          {reservations.length > 0 ? (
            reservations.map((schedule, index) => (
              <div key={index} className="reservation-item">
                <p>
                  <strong>Name:</strong> {schedule.user.name}
                </p>
                <p>
                  <strong>Worker:</strong> {schedule.worker.name}
                </p>
                <p>
                  <strong>Estimation:</strong> {schedule.estimasi}
                </p>
                <p>
                  <strong>Service:</strong> {schedule.service.service_name}
                </p>
                <p>
                  <strong>Price:</strong> {schedule.service.price}
                </p>
                <p>
                  <strong>Status:</strong> {schedule.reservation_status}
                </p>
                <p>
                  <strong>Description:</strong> {schedule.service.description}
                </p>
              </div>
            ))
          ) : (
            <p>No reservations available.</p>
          )}
        </div>
      </div>
    </div>
  );
};
