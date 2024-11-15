import React, { useState, useEffect } from "react";
import axios from "axios";

const DataDocumentation = () => {
  const [documentations, setDocumentations] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [newDocumentation, setNewDocumentation] = useState({
    worker_id: "",
    reservation_id: "",
    description: "",
    photo_url: null,
  });
  const [editingDocumentation, setEditingDocumentation] = useState(null);

  // Fetch initial data
  useEffect(() => {
    // Fetch documentations
    axios
      .get(`${process.env.REACT_APP_API_URL}/work_documentation`)
      .then((response) => {
        setDocumentations(response.data.data);
      })
      .catch((error) => console.error("Error fetching documentations", error));

    // Fetch workers for dropdown
    axios
      .get(`${process.env.REACT_APP_API_URL}/pekerja`)
      .then((response) => setWorkers(response.data.data))
      .catch((error) => console.error("Error fetching workers", error));

    // Fetch reservations for dropdown
    axios
      .get(`${process.env.REACT_APP_API_URL}/reservations`)
      .then((response) => setReservations(response.data.data))
      .catch((error) => console.error("Error fetching reservations", error));
  }, []);

  const handleAddDocumentation = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("worker_id", newDocumentation.worker_id);
    formData.append("reservation_id", newDocumentation.reservation_id);
    formData.append("description", newDocumentation.description);
    if (newDocumentation.photo_url) {
      formData.append("photo_url", newDocumentation.photo_url);
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}/work_documentation`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        setDocumentations([...documentations, response.data.data]);
        setShowModal(false);
        setNewDocumentation({
          worker_id: "",
          reservation_id: "",
          description: "",
          photo_url: null,
        });
      })
      .catch((error) => console.error("Error adding documentation", error));
  };

  const handleEditDocumentation = (documentation) => {
    setEditingDocumentation(documentation);
    setNewDocumentation(documentation);
    setShowModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("worker_id", newDocumentation.worker_id);
    formData.append("reservation_id", newDocumentation.reservation_id);
    formData.append("description", newDocumentation.description);
    if (newDocumentation.photo_url) {
      formData.append("photo_url", newDocumentation.photo_url);
    }
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/work_documentation/${editingDocumentation.documentation_id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then((response) => {
        const updatedDocumentations = documentations.map((data) =>
          data.documentation_id === editingDocumentation.documentation_id
            ? response.data.data
            : data
        );
        setDocumentations(updatedDocumentations);
        setShowModal(false);
        setNewDocumentation({
          worker_id: "",
          reservation_id: "",
          description: "",
          photo_url: null,
        });
        setEditingDocumentation(null);
      })
      .catch((error) => console.error("Error updating documentation", error));
  };

  const handleDeleteDocumentation = (documentation_id) => {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/work_documentation/${documentation_id}`
      )
      .then(() => {
        setDocumentations(
          documentations.filter(
            (data) => data.documentation_id !== documentation_id
          )
        );
      })
      .catch((error) => console.error("Error deleting documentation", error));
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocumentations = documentations.slice(startIndex, endIndex);

  const nextPage = () => {
    if (endIndex < documentations.length) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div id="datadocumentation">
      <nav>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Data Documentations</h2>
          <input
            type="text"
            placeholder="Search Documentation"
            value={searchQuery}
            onChange={handleSearch}
            className="form-control"
          />
          <div className="tambahdocumentation">
            <button
              className="btn btn-success"
              onClick={() => setShowModal(true)}
            >
              Tambah Documentation
            </button>
          </div>
        </div>
      </nav>
      <div id="table">
        <table className="table">
          <thead>
            <tr>
              <th>Worker</th>
              <th>Reservation ID</th>
              <th>Description</th>
              <th>Photo</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentDocumentations.map((documentation) => (
              <tr key={documentation.documentation_id}>
                <td>{documentation.worker.name}</td>
                <td>{documentation.reservation_id}</td>
                <td>{documentation.description}</td>
                <td>
                  <img
                    src={documentation.photo_url}
                    alt="Documentation"
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEditDocumentation(documentation)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      handleDeleteDocumentation(documentation.documentation_id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>
              {editingDocumentation
                ? "Edit Documentation"
                : "Add Documentation"}
            </h2>
            <form
              onSubmit={
                editingDocumentation ? handleSaveEdit : handleAddDocumentation
              }
            >
              <div className="form-group">
                <label>Worker:</label>
                <select
                  className="form-control"
                  value={newDocumentation.user_id}
                  onChange={(e) =>
                    setNewDocumentation({
                      ...newDocumentation,
                      worker_id: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Worker</option>
                  {workers.map((worker) => (
                    <option key={worker.name} value={worker.user_id}>
                      {worker.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Reservation:</label>
                <select
                  className="form-control"
                  value={newDocumentation.reservation_id}
                  onChange={(e) =>
                    setNewDocumentation({
                      ...newDocumentation,
                      reservation_id: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Reservation</option>
                  {reservations.map((reservation) => (
                    <option
                      key={reservation.service.service_name}
                      value={reservation.reservation_id}
                    >
                      {reservation.service.service_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Description:</label>
                <input
                  type="text"
                  className="form-control"
                  value={newDocumentation.description}
                  onChange={(e) =>
                    setNewDocumentation({
                      ...newDocumentation,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Photo:</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) =>
                    setNewDocumentation({
                      ...newDocumentation,
                      photo_url: e.target.files[0],
                    })
                  }
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary">
                  {editingDocumentation ? "Save Changes" : "Add"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingDocumentation(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 0}>
          Previous
        </button>
        <button onClick={nextPage} disabled={endIndex >= documentations.length}>
          Next
        </button>
      </div>
    </div>
  );
};

export default DataDocumentation;
