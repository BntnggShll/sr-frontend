import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Services = (props) => {
  const [services, setServices] = useState([]); 
  const [currentPage, setCurrentPage] = useState(0); 
  const servicesPerPage = 8; 

  // Mengambil data dari API
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/services`)
      .then(response => {
        if (response.data.success) {
          setServices(response.data.data);
        } else {
          console.error("Failed to fetch services");
        }
      })
      .catch(error => {
        console.error("Error fetching services", error);
      });
  }, []);

  // Menghitung batas bawah dan atas untuk slice
  const startIndex = currentPage * servicesPerPage;
  const endIndex = startIndex + servicesPerPage;
  const currentServices = services.slice(startIndex, endIndex);

  // Fungsi untuk ke halaman berikutnya
  const nextPage = () => {
    if (endIndex < services.length) {
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
    <section id='service' className='section active'>
      <div id="services" className="text-center">
        <div className="container">
          <div className="section-title">
            <h2><span>Services</span>
              <span>Menu</span>
            </h2>
          </div>
          <div className="row">
            {currentServices.length > 0 ? (
              currentServices.map((service) => (
                <div key={service.service_id} className="col-md-3">
                  <img src={service.image} alt="Service" className="img-fluid" />
                  <p>{service.service_name}</p> 
                </div>
              ))
            ) : (
              <p>No services available</p>
            )}
          </div>
          {/* Pagination Controls */}
          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 0}>
              Previous
            </button>
            <button onClick={nextPage} disabled={endIndex >= services.length}>
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
