import React, { useEffect, useState } from "react";
import axios from 'axios';

export const Team = (props) => {
  const [worker, setWorker] = useState([]);  
  const [currentPage, setCurrentPage] = useState(0); 
  const workersPerPage = 3; 

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/pekerja`)
      .then(response => {
        if (response.data.success) {
          setWorker(response.data.data);
        } else {
          console.error("Failed to fetch services");
        }
      })
      .catch(error => {
        console.error("Error fetching services", error);
      });
  }, []);

  // Menghitung batas bawah dan batas atas untuk slice
  const startIndex = currentPage * workersPerPage;
  const endIndex = startIndex + workersPerPage;
  const currentWorkers = worker.slice(startIndex, endIndex);

  // Fungsi untuk ke halaman berikutnya
  const nextPage = () => {
    if (endIndex < worker.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Fungsi untuk ke halaman sebelumnya
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);

    }
  };

  return (
    <div id="team" className="text-center">
      <div className="container">
        <div className="col-md-8 col-md-offset-2 section-title">
          <h2>
            <span>HAIR</span>
            <span>ARTIST</span>
          </h2>
        </div>
        <div className="row">
          {currentWorkers.length > 0 ? (
            currentWorkers.map((wo) => (
              <div key={wo.user_id} className="col-md-4">
                <img
                  src={wo.image}
                  alt="Worker"
                  className="img-fluid"
                />
                <p>{wo.name}<br/>
                    {wo.role}</p>
              </div>
            ))
          ) : (
            <p>No worker available</p>
          )}
        </div>
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 0}>
            Previous
          </button>
          <button onClick={nextPage} disabled={endIndex >= worker.length}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
