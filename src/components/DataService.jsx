import React, { useState, useEffect } from "react";
import axios from "axios";

const ServiceTable = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPageService, setCurrentPageService] = useState(0);
  const itemsPerPage = 10;
  const [newService, setNewService] = useState({
    service_name: "",
    description: "",
    price: "",
    duration: "",
    image: null,
  });
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/services`)
      .then((response) => {
        setServices(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching services", error);
      });
  }, []);

  const handleAddService = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("service_name", newService.service_name);
    formData.append("description", newService.description);
    formData.append("price", newService.price);
    formData.append("duration", newService.duration);
    if (newService.image) {
      formData.append("image", newService.image);
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}/services`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setServices([...services, response.data.data]);
        setShowModal(false);
        setNewService({
          service_name: "",
          description: "",
          price: "",
          duration: "",
          image: null,
        });
      })
      .catch((error) => {
        console.error("Error adding service", error);
      });
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setNewService(service);
    setShowModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("service_name", newService.service_name);
    formData.append("description", newService.description);
    formData.append("price", newService.price);
    formData.append("duration", newService.duration);
    if (newService.image) {
      formData.append("image", newService.image);
    }
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/services/${editingService.service_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        const updatedServices = services.map((data) =>
            data.service_id === editingService.service_id
            ? response.data.data
            : data
        );
        setServices(updatedServices);
        setShowModal(false);
        setNewService({
          service_name: "",
          description: "",
          price: "",
          duration: "",
          image: null,
        });
        setEditingService(null);
      })
      .catch((error) => {
        console.error("Error updating service", error);
      });
  };

  // Menghitung batas bawah dan atas untuk slice
  const startIndex = currentPageService * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = services.slice(startIndex, endIndex);

  // Fungsi untuk ke halaman berikutnya
  const nextPage = () => {
    if (endIndex < services.length) {
      setCurrentPageService(currentPageService + 1);
    }
  };

  // Fungsi untuk ke halaman sebelumnya
  const prevPage = () => {
    if (currentPageService > 0) {
      setCurrentPageService(currentPageService - 1);
    }
  };

  const handleDeleteService = (service_id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/services/${service_id}`)
      .then((response) => {
        setServices(
          services.filter((data) => data.service_id !== service_id)
        );
      })
      .catch((error) => {
        console.error("Error deleting service", error);
      });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div id="dataservice">
      <nav>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Data Services</h2>
          <input
            type="text"
            placeholder="Search Service"
            value={searchQuery}
            onChange={handleSearch}
            className="form-control"
          />
          <div className="tambahservice">
            <button
              className="btn btn-success"
              onClick={() => setShowModal(true)}
            >
              Tambah Service
            </button>
          </div>
        </div>
      </nav>
      <div id="table">
        <table className="table">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentServices.map((service) => (
              <tr key={service.service_id}>
                <td>{service.service_name}</td>
                <td>{service.description}</td>
                <td>{service.price}</td>
                <td>{service.duration}</td>
                <td>
                  <img
                    src={service.image}
                    alt={service.service_name}
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEditService(service)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteService(service.service_id)}
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
            <h2>{editingService ? "Edit Service" : "Tambah Service"}</h2>
            <form onSubmit={editingService ? handleSaveEdit : handleAddService}>
              <div className="form-group">
                <label>Service Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={newService.service_name}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      service_name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <input
                  type="text"
                  className="form-control"
                  value={newService.description}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  className="form-control"
                  value={newService.price}
                  onChange={(e) =>
                    setNewService({ ...newService, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration:</label>
                <input
                  type="text"
                  className="form-control"
                  value={newService.duration}
                  onChange={(e) =>
                    setNewService({ ...newService, duration: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URL:</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) =>
                    setNewService({ ...newService, image: e.target.files[0] })
                  }
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary">
                  {editingService ? "Save Changes" : "Add"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingService(null);
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
        <button onClick={prevPage} disabled={currentPageService === 0}>
          Previous
        </button>
        <button onClick={nextPage} disabled={endIndex >= services.length}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ServiceTable;
