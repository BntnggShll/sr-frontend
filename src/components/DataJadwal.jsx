import React, { useState, useEffect } from "react";
import axios from "axios";

const ScheduleTable = () => {
  const [schedules, setSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPageSchedule, setCurrentPageSchedule] = useState(0);
  const itemsPerPage = 10;
  const [newSchedule, setNewSchedule] = useState({
    available_time_start: "",
    available_time_end: "",
    available_date: "",
    status: "Available",
  });
  const [editingSchedule, setEditingSchedule] = useState(null);

  useEffect(() => {
    // Fetch schedules
    axios
      .get(`${process.env.REACT_APP_API_URL}/schedules`)
      .then((response) => {
        setSchedules(response.data.schedule);
      })
      .catch((error) => {
        console.error("Error fetching schedules", error);
      });
      
  }, []);

  const handleAddSchedule = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API_URL}/schedules`, newSchedule)
      .then((response) => {
        setSchedules([...schedules, response.data.schedule]);
        setShowModal(false);
        setNewSchedule({
          available_time_start: "",
          available_time_end: "",
          available_date: "",
          status: "Available",
        });
      })
      .catch((error) => {
        console.error("Error adding schedule", error);
      });
  };

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setNewSchedule(schedule);
    setShowModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/schedules/${editingSchedule.schedule_id}`,
        newSchedule
      )
      .then((response) => {
        const updatedSchedules = schedules.map((schedule) =>
          schedule.schedule_id === editingSchedule.schedule_id
            ? response.data.schedule
            : schedule
        );
        setSchedules(updatedSchedules);
        setShowModal(false);
        setNewSchedule({
          available_time_start: "",
          available_time_end: "",
          available_date: "",
          status: "Available",
        });
        setEditingSchedule(null);
      })
      .catch((error) => {
        console.error("Error updating schedule", error);
      });
  };

  const handleDeleteSchedule = (schedule_id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/schedules/${schedule_id}`)
      .then(() => {
        setSchedules(
          schedules.filter((schedule) => schedule.schedule_id !== schedule_id)
        );
      })
      .catch((error) => {
        console.error("Error deleting schedule", error);
      });
  };

  const filteredSchedules = schedules.filter((schedule) =>
    String(schedule.available_date).toLowerCase().includes(searchQuery.toLowerCase())
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
          <div className="tambahjadwal">
          <button className="btn btn-success" onClick={() => setShowModal(true)}>
            Tambah Schedule
          </button>
          </div>
        </div>
      </nav>
      <div id="table">
      <table className="table">
        <thead>
          <tr>
            <th>Available Time Start</th>
            <th>Available Time End</th>
            <th>Available Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentSchedules.map((schedule) => (
            <tr key={schedule.schedule_id}>
              <td>{schedule.available_time_start}</td>
              <td>{schedule.available_time_end}</td>
              <td>{schedule.available_date}</td>
              <td>{schedule.status}</td>
              <td>
                <button
                  className="btn btn-warning"
                  onClick={() => handleEditSchedule(schedule)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteSchedule(schedule.schedule_id)}
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
        <button onClick={prevPage} disabled={currentPageSchedule === 0}>
          Previous
        </button>
        <button onClick={nextPage} disabled={endIndex >= filteredSchedules.length}>
          Next
        </button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingSchedule ? "Edit Schedule" : "Tambah Schedule"}</h2>
            <form onSubmit={editingSchedule ? handleSaveEdit : handleAddSchedule}>
              <div className="form-group">
                <label>Available Time Start:</label>
                <input
                  type="time"
                  className="form-control"
                  value={newSchedule.available_time_start}
                  onChange={(e) =>
                    setNewSchedule({
                      ...newSchedule,
                      available_time_start: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Available Time End:</label>
                <input
                  type="time"
                  className="form-control"
                  value={newSchedule.available_time_end}
                  onChange={(e) =>
                    setNewSchedule({
                      ...newSchedule,
                      available_time_end: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Available Date:</label>
                <input
                  type="date"
                  className="form-control"
                  value={newSchedule.available_date}
                  onChange={(e) =>
                    setNewSchedule({
                      ...newSchedule,
                      available_date: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  className="form-control"
                  value={newSchedule.status}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, status: e.target.value })
                  }
                >
                  <option value="Available">Available</option>
                  <option value="Booked">Booked</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary">
                  {editingSchedule ? "Save Changes" : "Add"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingSchedule(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleTable;
