import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingList = () => {
  const [services, setServices] = useState([]); 
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/service`)
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

  // Menentukan indeks awal dan akhir untuk pagination
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedServices = services.slice(startIndex, endIndex);

  // Fungsi untuk ke halaman sebelumnya
  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  // Fungsi untuk ke halaman berikutnya
  const nextPage = () => {
    if (endIndex < services.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div>
    <section id='service' className='section active'>
      <div id="services" className="text-center">
        <div className="container">
          <div className="section-title">
            <h2>Services</h2>
          </div>
          <div className="row">
            {paginatedServices.length > 0 ? (
              paginatedServices.map((service) => (
                <div key={service.service_id} className="col-md-3">
                  <img src={service.image} alt="Service" className="img-fluid" />
                  <a href="#"><p>{service.service_name}</p></a>
                </div>
              ))
            ) : (
              <p>No services available</p>
            )}
          </div>

          {/* Pagination buttons */}
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
    </div>
  );
};

export default BookingList;
