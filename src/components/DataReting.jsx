import React, { useState, useEffect } from "react";
import axios from "axios";

const DataRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Fetch data ratings
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/reviews`)
      .then((response) => setRatings(response.data))
      .catch((error) => console.error("Error fetching ratings", error));
  }, []);

  // Filter data berdasarkan pencarian
  const filteredRatings = ratings.filter((rating) =>
    rating.feedback.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRatings = filteredRatings.slice(startIndex, endIndex);

  const nextPage = () => {
    if (endIndex < filteredRatings.length) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  // Render
  return (
    <div id="datareting">
        <nav>
      <h2>Data Ratings</h2>
      <input
        type="text"
        placeholder="Search feedback"
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
              <th>Worker</th>
              <th>Rating</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {currentRatings.map((rating) => (
              <tr key={rating.review_id}>
                <td>{rating.reservation_id}</td>
                <td>{rating.user.name}</td>
                <td>{rating.worker.name}</td>
                <td>{rating.rating}</td>
                <td>{rating.feedback}</td>
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
};

export default DataRatings;
