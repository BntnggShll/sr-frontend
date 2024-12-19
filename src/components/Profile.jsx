import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null); // Menggunakan null sebagai nilai awal
  const [error, setError] = useState(null); // State untuk menangani error
  const navigate = useNavigate(); // Inisialisasi navigate

  useEffect(() => {
    const token = localStorage.getItem('token'); // Mengambil token dari localStorage

    if (token) {
      try {
        const decoded = jwtDecode(token); // Mendekode token
        setUser(decoded); // Menyimpan hasil dekode ke state user
      } catch (error) {
        console.error("Error decoding token", error);
        setError("Invalid token format or missing parts."); // Menangani error
        navigate('/login'); // Navigasi ke login jika token tidak valid
      }
    } else {
      console.log("No token found");
      navigate('/login'); // Navigasi ke login jika tidak ada token
    }
  }, [navigate]); // Tambahkan navigate ke dependency array

  if (error) {
    return <div>{error}</div>; // Menampilkan pesan error jika ada
  }

  if (!user) {
    // Menampilkan loading atau message jika data belum tersedia
    return <div>Loading...</div>;
  }
  return (
    <div id='profile'>
      <div className='image-container'>
        <img src="./img/tes.jpg" alt="Profile Cover" className='imgsampul' />
      </div>
      <div>
        <img src="./img/about.jpg" alt="Profile" className='tes' />
        <h2>{user.name}</h2> {/* Menampilkan nama pengguna dari token */}
      </div>
      <div className='edit'>
        <button className='a'>Edit Profile</button>
        <button className='b'>Setting</button>
      </div>
      <div className='table'> 
        <p className='judul'>Email</p>
        <p className='isi'>{user.email}</p> {/* Menampilkan email pengguna dari token */}
        <p className='judul'>No Telepon</p>
        <p className='isi'>{user.phone_number}</p> {/* Menampilkan nomor telepon pengguna dari token */}
        <p className='judul'>Subscription Status</p>
        <p className='isi'>{user.subscription_status}</p> {/* Menampilkan status langganan pengguna dari token */}
        <p className='judul'>Points</p>
        <p className='isi'>{user.points}</p> {/* Menampilkan poin pengguna dari token */}
      </div>
    </div>
  );
};

export default Profile;
