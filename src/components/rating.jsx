import axios from "axios";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export const Rating = () => {
  const [reviews, setReviews] = useState([]);
  const [Reservation, setReservation] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [feedbackValue, setFeedbackValue] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedReservation, setSelectedReservation] = useState("");
  const navigate = useNavigate();

  // Fetch reviews
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/reviews`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, []);
  // Decode token
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Error decoding token", error);
      }
    } 
  }, [navigate]);
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        if (user?.name) {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/reservations`
          );
          const reservations = response.data.data;
          const filteredReservations = reservations.filter(
            (reservation) =>
              reservation.user.name === user.name &&
              reservation.reservation_status === "Completed"
          );

          setReservation(filteredReservations);
        }
      } catch (error) {
        console.error("Error fetching reservations", error);
        setError("Failed to fetch reservations.");
      }
    };

    fetchReservations();
  }, [user, reviews]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`filled-${i}`} className="star filled">
          ★
        </span>
      );
    }
    if (halfStar) {
      stars.push(
        <span key="half" className="star half">
          ★
        </span>
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty">
          ★
        </span>
      );
    }

    return stars;
  };

  const handleSubmitReview = () => {
    if (feedbackValue && selectedRating && selectedReservation) {
      axios
        .post(`${process.env.REACT_APP_API_URL}/reviews`, {
          feedback: feedbackValue,
          rating: selectedRating,
          user_id: user.user_id,
          reservation_id: selectedReservation.reservationId,
          worker_id: selectedReservation.workerId,
        })
        .then((response) => {
          toast.success("Review submitted successfully!");
          axios.put(`${process.env.REACT_APP_API_URL}/rating/${selectedReservation.reservationId}`)

          axios
          .get(`${process.env.REACT_APP_API_URL}/reviews`)
          .then((response) => {
            setReviews(response.data); 
          })
          .catch((error) => {
            console.error("Error fetching updated reviews:", error);
          });
          setFeedbackValue("");
          setSelectedReservation("");
          setSelectedRating(0);
        })
        .catch((error) => {
          console.error("Error submitting review:", error);
        });
    } else {
      alert("Please fill in all fields.");
    }
  };

  const averageRating = reviews
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : null;

  const ratingCounts = [1, 2, 3, 4, 5].map((rating) =>
    reviews ? reviews.filter((review) => review.rating === rating).length : 0
  );

  const maxReviews = Math.max(...ratingCounts);

  return (
    <div id="rating">
      <div className="title">
        <div className="left">
          <h2>
            <span>Average</span>
            <span>Rating</span>
          </h2>
          <div className="reting">
            {averageRating !== null ? (
              <div>
                <div className="stars">
                  <span>
                    <h2>{averageRating.toFixed(1)}</h2>
                  </span>
                  <span>
                    <p> 
                      Out of <br /> 5 stars{" "}
                    </p>
                  </span>
                  <span>
                    {renderStars(averageRating)}
                  </span>
                </div>
                <div className="rating-distribution">
                  {ratingCounts.map((count, index) => (
                    <div key={index} className="rating-distribution-bar">
                      <span>{index + 1}</span>
                      <div
                        className="rating-bar"
                        style={{
                          width: `${(count / maxReviews) * 83}%`,
                          backgroundColor: "#D7843E",
                        }}
                      ></div>
                      <span>{count} reviews</span>
                    </div>
                  ))}
                </div>
                <h3 style={{ color: "black" }}>Write your Review</h3>
                <select
                  value={selectedReservation}
                  onChange={(e) => {
                    const [reservationId, workerId] = e.target.value.split(",");
                    setSelectedReservation({
                      reservationId,
                      workerId,
                    });
                  }}
                  className="dropdown"
                >
                  <option value="" disabled>
                    Select reservation
                  </option>
                  {Reservation.map((reservation) => (
                    <option
                      key={reservation.reservation_id}
                      value={`${reservation.reservation_id},${reservation.worker.user_id}`}
                    >
                      {reservation.worker.name +
                        " " +
                        reservation.service.service_name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(Number(e.target.value))}
                  className="dropdown"
                >
                  <option value="0" disabled>
                    {" "}
                    Select Rating{" "}
                  </option>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
                <textarea
                  value={feedbackValue}
                  onChange={(e) => setFeedbackValue(e.target.value)}
                  className="input"
                  placeholder="Share your feedback"
                ></textarea>
                <button className="reviewinput" onClick={handleSubmitReview}>
                  Submit Reviews
                </button>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        <div className="right">
          <h2>
            <span>Customer</span>
            <span>Feedback</span>
          </h2>
          <div className="feedback-container">
            {reviews ? (
              reviews.map((review) => (
                <div key={review.review_id} className="feedback">
                    <img
                      src={review.user.image}
                      alt={review.user.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "100px",
                      }}
                    />
                  <span>
                    <h3 style={{ marginLeft: "20px", marginTop: "10px" }}>
                      {review.user.name}
                    </h3>
                  </span>
                  <span>
                    <h6 style={{ marginTop: "40px", marginLeft: "-27px" }}>
                      {review.formatted_date}
                    </h6>
                  </span>
                  <span style={{ marginLeft: "300px", marginTop: "-10px" }}>
                    {renderStars(review.rating)}
                  </span>
                  <p
                    style={{
                      marginTop: "75px",
                      marginLeft: "-550px",
                      width: "550px",
                      wordWrap: "break-word",
                    }}
                  >
                    {review.feedback}
                  </p>
                </div>
              ))
            ) : (
              <p>No feedback available</p>
            )}
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};
