import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ScheduleTable = () => {
  const [user, setUser] = useState(null); // State untuk user
  const [error, setError] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPageSchedule, setCurrentPageSchedule] = useState(0);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Mengambil token dari Session Storage

    if (token) {
      try {
        const decoded = jwtDecode(token); // Mendekode token
        setUser(decoded);
      } catch (error) {
        console.error("Error decoding token", error);
        setError("Invalid token format or missing parts.");
      }
    } else {
      console.log("No token found");
    }
  }, [navigate]);

  useEffect(() => {
    if (user && user.user_id) {
      // Pastikan data user ada sebelum menjalankan efek
      // Fetch schedules
      axios
        .get(`${process.env.REACT_APP_API_URL}/schedules`)
        .then((response) => {
          const schedules = response.data.schedule.filter(
            (e) => e.worker_id === user.user_id
          );
          setSchedules(schedules);
        })
        .catch((error) => {
          console.error("Error fetching schedules", error);
        });
    }
  }, [user]); // Menambahkan user sebagai dependency

  const filteredSchedules = schedules.filter((schedule) =>
    String(schedule.available_date)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const startIndex = currentPageSchedule * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSchedules = filteredSchedules.slice(startIndex, endIndex);

  const nextPage = () => {
    if (endIndex < filteredSchedules.length) {
      setCurrentPageSchedule(currentPageSchedule + 1);
    }
  };

  const prevPage = () => {
    if (currentPageSchedule > 0) {
      setCurrentPageSchedule(currentPageSchedule - 1);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div id="dataschedule">
      <nav>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Schedule Management</h2>
          <input
            type="text"
            placeholder="Search Schedule"
            value={searchQuery}
            onChange={handleSearch}
            className="form-control"
          />
        </div>
      </nav>
      <div id="table">
        <table className="table">
          <thead>
            <tr>
              <th>Worker</th>
              <th>Available Time Start</th>
              <th>Available Time End</th>
              <th>Available Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentSchedules.map((schedule) => (
              <tr key={schedule.schedule_id}>
                <td>{schedule.worker.name}</td>
                <td>{schedule.available_time_start}</td>
                <td>{schedule.available_time_end}</td>
                <td>{schedule.available_date}</td>
                <td>{schedule.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPageSchedule === 0}>
          Previous
        </button>
        <button
          onClick={nextPage}
          disabled={endIndex >= filteredSchedules.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ScheduleTable;
