import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null); // State untuk user
  const [error, setError] = useState(null); // State untuk menangani error
  const [showModal, setShowModal] = useState(false); // State untuk modal logout
  const [showEditModal, setShowEditModal] = useState(false); // State untuk modal edit
  const [formData, setFormData] = useState({
    // State untuk form edit
    email: "",
    password: "",
    phone_number: "",
    image: null,
  });
  const navigate = useNavigate(); // Inisialisasi navigate

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Mengambil token dari Session Storage

    if (token) {
      try {
        const decoded = jwtDecode(token); // Mendekode token
        setUser(decoded); 
      } catch (error) {
        console.error("Error decoding token", error);
        setError("Invalid token format or missing parts."); // Menangani error
        navigate("/login"); // Navigasi ke login jika token tidak valid
      }
    } else {
      console.log("No token found");
      navigate("/login"); // Navigasi ke login jika tidak ada token
    }
  }, [navigate]); // Tambahkan navigate ke dependency array

  // Fungsi untuk logout
  const handleLogout = () => {
    sessionStorage.removeItem("token"); // Hapus token dari Session Storage
    navigate("/login"); // Arahkan ke halaman login
  };

  // Fungsi untuk mengubah nilai input
  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = new FormData();

    // Tambahkan hanya jika ada perubahan data
    if (formData.email && formData.email !== user.email) {
      dataToSend.append("email", formData.email);
    }
    if (formData.phone_number && formData.phone_number !== user.phone_number) {
      dataToSend.append("phone_number", formData.phone_number);
    }
    if (formData.password) {
      dataToSend.append("password", formData.password); // Password tidak dibandingkan untuk keamanan
    }
    if (formData.image) {
      dataToSend.append("image", formData.image); // Tambahkan gambar jika ada
    }

    // Jika tidak ada perubahan, beri notifikasi dan keluar dari fungsi
    if (dataToSend.keys().next().done) {
      toast.info("No changes made", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    // Kirim data ke server
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/user/${user.user_id}`,
        dataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          sessionStorage.setItem("token", response.data.token);

          toast.success("Profile updated successfully", {
            position: "top-center",
            autoClose: 3000,
          });
          setUser(response.data.user); // Update data user
          setShowEditModal(false); // Tutup modal
        } else {
          setError("Failed to update profile");
        }
      })
      .catch((error) => {
        console.error("Error updating profile", error);
        toast.error("An error occurred while updating the profile", {
          position: "top-center",
          autoClose: 3000,
        });
      });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0], // Menyimpan file gambar
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value, // Menyimpan input teks
      }));
    }
  };

  if (error) {
    return <div>{error}</div>; // Menampilkan pesan error jika ada
  }

  if (!user) {
    // Menampilkan loading atau message jika data belum tersedia
    return <div>Loading...</div>;
  }
  return (
    <div id="profile">
      <div className="image-container">
        <img src="./img/tes.jpg" alt="Profile Cover" className="imgsampul" />
      </div>
      <div>
        <img src={user.image} alt="Profile" className="tes" />
        <h2>{user.name}</h2> {/* Menampilkan nama pengguna dari token */}
      </div>
      <div className="edit">
        <button className="a" onClick={() => setShowEditModal(true)}>
          Edit Profile
        </button>
        <button className="b" onClick={() => setShowModal(true)}>
          Log Out
        </button>
      </div>
      <div className="table">
        <p className="judul">Email</p>
        <p className="isi">{user.email}</p>{" "}
        {/* Menampilkan email pengguna dari token */}
        <p className="judul">No Telepon</p>
        <p className="isi">{user.phone_number}</p>{" "}
        {/* Menampilkan nomor telepon pengguna dari token */}
        {user && user.role === "User" && (
          <>
            <p className="judul">Subscription Status</p>
            <p className="isi">{user.subscription_status || "Not available"}</p>
            <p className="judul">Points</p>
            <p className="isi">{user.points || "No points available"}</p>
          </>
        )}
      </div>

      {/* Modal Logout */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h1>Confirm Logout</h1>
            <p>Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button onClick={handleLogout} className="confirm-button">
                Yes, Logout
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Profile */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter new email"
              />
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
              />
              <label>Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Enter new phone number"
              />
              <label>Profile Image</label>
              <input type="file" name="image" onChange={handleChange} />
              <button type="submit">Update</button>
              <button type="button" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Profile;
