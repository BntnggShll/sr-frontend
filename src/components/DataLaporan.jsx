import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DataLaporan() {
  // State untuk menyimpan data, pencarian, dan pagination
  const [ratings, setRatings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);

  // Fetch data dari API Laravel
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/reservations`);
        setRatings(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredRatings = ratings.filter(
    (rating) =>
      rating.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rating.service.service_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRatings = filteredRatings.slice(startIndex, endIndex);

  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  return (
    <div id="datareting">
      <nav>
        <h2>Data Reservations</h2>
        <input
          type="text"
          placeholder="Search User"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control"
          style={{ marginBottom: "20px" }}
        />
      </nav>
      <div id="table">
        <table className="table">
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th>User</th>
              <th>Service</th>
              <th>Worker</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {currentRatings.map((rating) => (
              <tr key={rating.reservation_id}>
                <td>{rating.reservation_id}</td>
                <td>{rating.user.name}</td>
                <td>{rating.service.service_name}</td>
                <td>{rating.worker.name || "N/A"}</td>
                <td>{rating.reservation_status}</td>
                <td>{rating.formatted_date}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 0}>
          Previous
        </button>
        <button
          onClick={nextPage}
          disabled={endIndex >= filteredRatings.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DataLaporan;
