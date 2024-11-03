import React, { useState, useEffect } from "react";
import axios from "axios";

const DataUser = () => {
  const [view, setView] = useState("pekerja"); // State untuk menentukan halaman yang dilihat
  const [pekerja, setPekerja] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPagePekerja, setCurrentPagePekerja] = useState(0); // State untuk halaman pekerja
  const [currentPageUser, setCurrentPageUser] = useState(0); // State untuk halaman user
  const itemsPerPage = 10; // Maksimal 10 data per halaman
  const [searchQuery, setSearchQuery] = useState(""); // State untuk pencarian
  const [showModal, setShowModal] = useState(false);
  const [newPekerja, setNewPekerja] = useState({
    name: "",
    email: "",
    phone_number: "",
    password:"",
  });

  // Mengambil data pekerja
  useEffect(() => {
    if (view === "pekerja") {
      axios
        .get(`${process.env.REACT_APP_API_URL}/pekerja`)
        .then((response) => {
          setPekerja(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching pekerja", error);
        });
    }
  }, [view]);

  // Mengambil data user
  useEffect(() => {
    if (view === "user") {
      axios
        .get(`${process.env.REACT_APP_API_URL}/user`)
        .then((response) => {
          setUsers(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching users", error);
        });
    }
  }, [view]);

  // Fungsi untuk menghapus data
  const handleDelete = (user_id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/user/${user_id}`)
      .then((response) => {
        setPekerja((prevPekerja) =>
          prevPekerja.filter((item) => item.user_id !== user_id)
        );
      })
      .catch((error) => {
        console.error("Error deleting user", error);
      });
  };

  // Pagination untuk pekerja
  const startIndexPekerja = currentPagePekerja * itemsPerPage;
  const endIndexPekerja = startIndexPekerja + itemsPerPage;
  const currentPekerja = pekerja.slice(startIndexPekerja, endIndexPekerja);

  const nextPagePekerja = () => {
    if (endIndexPekerja < pekerja.length) {
      setCurrentPagePekerja((prevPage) => prevPage + 1);
    }
  };

  const prevPagePekerja = () => {
    if (currentPagePekerja > 0) {
      setCurrentPagePekerja((prevPage) => prevPage - 1);
    }
  };

  // Pagination untuk user
  const startIndexUser = currentPageUser * itemsPerPage;
  const endIndexUser = startIndexUser + itemsPerPage;
  const currentUser = users.slice(startIndexUser, endIndexUser);

  const nextPageUser = () => {
    if (endIndexUser < users.length) {
      setCurrentPageUser((prevPage) => prevPage + 1);
    }
  };

  const prevPageUser = () => {
    if (currentPageUser > 0) {
      setCurrentPageUser((prevPage) => prevPage - 1);
    }
  };

  // Fungsi untuk pencarian
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter user berdasarkan searchQuery
  const filteredData =
    view === "pekerja"
      ? currentPekerja.filter(
          (pekerja) =>
            pekerja.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pekerja.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : currentUser.filter(
          (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const handleAddPekerja = (e) => {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_API_URL}/registerpekerja`, newPekerja)
      .then((response) => {
            
        setShowModal(false);
        setNewPekerja({
          name: "",
          email: "",
          phone_number: "",
          password:"",
        });
        window.location.reload();
      })
      
      .catch((error) => {
        console.error("Error adding pekerja", error);
      });
  };

  return (
    <div id="datauser">
      {/* Navbar di atas */}
      <nav>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h2>{view === "pekerja" ? "Pekerja" : "User"}</h2>
          </div>

          {/* Search bar */}
          <div>
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={handleSearch}
              className="form-control"
            />
          </div>
          <div className="tambah-pekerja">
            {/* Tombol Tambah User */}
            <button
              className="btn btn-success "
              onClick={() => setShowModal(true)}
            >
              Tambah Pekerja
            </button>
          </div>
        </div>
      </nav>
      <div>
        {/* Modal Popup Form Tambah Pekerja */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Tambah Pekerja</h2>
              <form onSubmit={handleAddPekerja}>
                <div className="form-group">
                  <label>Nama:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newPekerja.name}
                    onChange={(e) =>
                      setNewPekerja({
                        ...newPekerja,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    value={newPekerja.email}
                    onChange={(e) =>
                      setNewPekerja({
                        ...newPekerja,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>No. Telepon:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newPekerja.phone_number}
                    onChange={(e) =>
                      setNewPekerja({
                        ...newPekerja,
                        phone_number: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPekerja.password}
                    onChange={(e) =>
                      setNewPekerja({
                        ...newPekerja,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="modal-buttons">
                  <button type="submit" className="btn btn-primary">
                    Tambah
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <div>
        <a
          onClick={() => setView("pekerja")}
          className={`${view === "pekerja" ? "active" : ""}`}
        >
          <button className="tombol"> Pekerja</button>
        </a>
        <a
          onClick={() => setView("user")}
          className={`${view === "user" ? "active" : ""}`}
        >
          <button className="tombol">User</button>
        </a>
      </div>

      <div id="table">
        {view === "pekerja" ? (
          pekerja.length > 0 ? (
            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>No. Telepon</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={item.user_id}>
                      <td>{startIndexPekerja + index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone_number}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(item.user_id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tombol pagination */}
              <div className="pagination">
                <button
                  onClick={prevPagePekerja}
                  disabled={currentPagePekerja === 0}
                >
                  Previous
                </button>
                <button
                  onClick={nextPagePekerja}
                  disabled={endIndexPekerja >= pekerja.length}
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <p>Tidak ada data pekerja</p>
          )
        ) : users.length > 0 ? (
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>No. Telepon</th>
                  <th>Subscription</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.user_id}>
                    <td>{startIndexUser + index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.phone_number}</td>
                    <td>
                      <div
                        className={
                          item.subscription_status === "Aktif"
                            ? "aktif-class"
                            : "non-aktif-class"
                        }
                      >
                        {item.subscription_status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Tombol pagination */}
            <div className="pagination">
              <button onClick={prevPageUser} disabled={currentPageUser === 0}>
                Previous
              </button>
              <button
                onClick={nextPageUser}
                disabled={endIndexUser >= users.length}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p>Tidak ada data user</p>
        )}
      </div>
    </div>
  );
};

export default DataUser;
