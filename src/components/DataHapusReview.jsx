import React, { useState, useEffect } from "react";
import axios from "axios";

const DataHapusReview = () => {
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);

  // Fetch data dari API Laravel
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/reviews`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchData();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredReviews = reviews.filter((review) =>
    [
      review.user?.name?.toLowerCase(),
      review.service?.service_name?.toLowerCase(),
    ].some((field) =>
      field?.includes(searchQuery.toLowerCase())
    )
  );

  // Pagination
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviews = filteredReviews.slice(startIndex, endIndex);

  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  // Fungsi untuk menghapus review
  const deleteReview = async (review_id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/reviews/${review_id}`
        );
        // Perbarui daftar review setelah dihapus
        setReviews((prevReviews) =>
          prevReviews.filter(
            (review) => review.review_id !== review_id
          )
        );
        alert("Review deleted successfully.");
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  return (
    <div id="datareting">
      <nav>
        <h2>Data Reviews</h2>
        <input
          type="text"
          placeholder="Search User or Service"
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
              <th>Time</th>
              <th>FeedBack</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.map((review) => (
              <tr key={review.review_id}>
                <td>{review.reservation_id}</td>
                <td>{review.user?.name || "N/A"}</td>
                <td>{review.worker?.name || "N/A"}</td>
                <td>{review.formatted_date || "N/A"}</td>
                <td>{review.feedback || "N/A"}</td>
                <td>
                  <button
                    onClick={() => deleteReview(review.review_id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
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
          disabled={endIndex >= filteredReviews.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataHapusReview;
