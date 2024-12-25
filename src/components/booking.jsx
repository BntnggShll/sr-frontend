import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingList = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Menggunakan null sebagai nilai awal
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [selectedkonfirmasi, setSelectedkonfirmasi] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // Menyimpan tanggal yang dipilih
  const [selectedSchedule, setSelectedSchedule] = useState(null); // Menyimpan jadwal yang dipilih
  const workersPerPage = 3;
  const itemsPerPage = 8;
  const itemjadwal = 10;

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Mengambil token dari sessionStorage
    if (token) {
      try {
        const decoded = jwtDecode(token); // Mendekode token
        setUser(decoded); // Menyimpan hasil dekode ke state user
      } catch (error) {
        console.error("Error decoding token", error);
        setError("Invalid token format or missing parts."); 
      }
    } else {
      console.log("No token found");
    }

    const fetchData = async () => {
      try {
        axios
          .get(`${process.env.REACT_APP_API_URL}/services`)
          .then((response) => {
            if (response.data.success) {
              setServices(response.data.data);
            } else {
              console.error("Failed to fetch services");
            }
          })
          .catch((error) => {
            console.error("Error fetching services", error);
          });

        // Ambil data workers
        axios
          .get(`${process.env.REACT_APP_API_URL}/pekerja`)
          .then((response) => {
            if (response.data.success) {
              setWorkers(response.data.data);
            } else {
              console.error("Failed to fetch workers");
            }
          })
          .catch((error) => {
            console.error("Error fetching workers", error);
          });

        // Ambil data schedules
        axios
          .get(`${process.env.REACT_APP_API_URL}/schedules`)
          .then((response) => {
            const available = response.data.schedule.filter(
              (e)=> e.status === "Available" 
            );
            setSchedules(available);
          })
          .catch((error) => {
            console.error("Error fetching schedules", error);
          });
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);  


  const startIndexServices = currentPage * itemsPerPage;
  const endIndexServices = startIndexServices + itemsPerPage;
  const paginatedServices = services.slice(
    startIndexServices,
    endIndexServices
  );

  const startIndexWorkers = currentPage * workersPerPage;
  const endIndexWorkers = startIndexWorkers + workersPerPage;
  const currentWorkers = workers.slice(startIndexWorkers, endIndexWorkers);

  const startIndexjadwal = currentPage * itemjadwal;
  const endIndexjadwal = startIndexjadwal + itemjadwal;
  const currentjadwal = schedules.slice(startIndexjadwal, endIndexjadwal);

  const handleServiceClick = (service_id) => {
    setSelectedServiceId(service_id);
  };

  const handleWorkerClick = (user_id) => {
    setSelectedWorkerId(user_id);
  };

  const handleKonfirmasi = (schedule_id) => {
    setSelectedkonfirmasi(schedule_id);
  };
  const handleBooking = (price) => {
    const reservation = {
      service_id: selectedServiceId,
      worker_id: selectedWorkerId,
      schedule_id: selectedkonfirmasi,
      user_id: user.user_id,
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/reservations`, reservation)
      .then((response) => {
        axios.put(`${process.env.REACT_APP_API_URL}/points/${user.user_id}`)
        axios.put(`${process.env.REACT_APP_API_URL}/booked/${selectedkonfirmasi}`)
        navigate("/payment", {
          state: {
            payable_type: "App\\Models\\Services",
            payable_id: selectedServiceId,
            amount: price,
          },
        });
        setSelectedServiceId(null);
        setSelectedWorkerId(null);
        setSelectedkonfirmasi(null);
      })
      .catch((error) => console.error("Error booking", error));
  };

  const backToServices = () => {
    setSelectedServiceId(null);
  };

  const backToWorkers = () => {
    setSelectedWorkerId(null);
  };

  const prevPageServices = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const nextPageServices = () => {
    if (endIndexServices < services.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPageWorkers = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const nextPageWorkers = () => {
    if (endIndexWorkers < workers.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date); // Menyimpan tanggal yang dipilih
    const formattedDate = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);

    // Filter semua jadwal yang sesuai
    const availableSchedules = schedules.filter(
      (schedule) =>
        schedule.worker_id === selectedWorkerId &&
        schedule.available_date === formattedDate &&
        schedule.status === "Available"
    );

    setSelectedSchedule(availableSchedules);
  };

  return (
    <div>
      {/* Section Services */}
      {selectedServiceId === null &&
        selectedWorkerId === null &&
        selectedkonfirmasi === null && (
          <section id="service" className="section active">
            <div id="services" className="text-center">
              <div className="container">
                <div className="section-title">
                  <h2>Services</h2>
                </div>
                <div className="row">
                  {paginatedServices.length > 0 ? (
                    paginatedServices.map((service) => (
                      <div
                        key={service.service_id}
                        className="col-md-3"
                        onClick={() => handleServiceClick(service.service_id)}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={service.image}
                          alt="Service"
                          className="img-fluid"
                        />
                        <p>{service.service_name}</p>
                      </div>
                    ))
                  ) : (
                    <p>No services available</p>
                  )}
                </div>
                <div className="pagination">
                  <button
                    onClick={prevPageServices}
                    disabled={currentPage === 0}
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextPageServices}
                    disabled={endIndexServices >= services.length}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

      {/* Section Team */}
      {selectedServiceId !== null &&
        selectedWorkerId === null &&
        selectedkonfirmasi === null && (
          <div id="team" className="text-center">
            <div className="container">
              <div className="col-md-8 col-md-offset-2 section-title">
                <h2>
                  <span>HAIR</span>
                  <span>ARTIST</span>
                </h2>
                <button onClick={backToServices}>Back to Services</button>
              </div>
              <div className="row">
                {currentWorkers.length > 0 ? (
                  currentWorkers.map((worker) => (
                    <div key={worker.user_id} className="col-md-4">
                      <img
                        src={worker.image}
                        alt="Worker"
                        className="img-fluid"
                      />
                      <button
                        onClick={() => handleWorkerClick(worker.user_id)}
                        className="tombol"
                      >
                        <p className="border">
                          {worker.name}
                          <br />
                          {worker.role}
                        </p>
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No workers available</p>
                )}
              </div>
              <div className="pagination">
                <button onClick={prevPageWorkers} disabled={currentPage === 0}>
                  Previous
                </button>
                <button
                  onClick={nextPageWorkers}
                  disabled={endIndexWorkers >= workers.length}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Section Jadwal */}
      {selectedWorkerId !== null && selectedkonfirmasi === null && (
        <div id="jadwal" className="text-center">
          <h2>
            <span>PILIH</span>
            <span>JADWAL</span>
          </h2>
          <button onClick={backToWorkers}>Back to Workers</button>
          <div className="calender">
            <Calendar minDate={new Date()} onClickDay={handleDateClick} />
            <div className="selectcalender">
              {selectedSchedule ? (
                <div>
                  {selectedSchedule.length > 0 ? (
                    selectedSchedule.slice(0 > 10).map((jadwal) => (
                      <div key={jadwal.schedule_id}>
                        <button
                          onClick={() => handleKonfirmasi(jadwal.schedule_id)}
                          style={{
                            marginTop: "-10px",
                            marginBottom: "15px",
                            border: "none",
                            backgroundColor: "#d7843e",
                            color: "#fff",
                          }}
                        >
                          Start Time: {jadwal.available_time_start}
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>Tidak ada jadwal yang tersedia untuk tanggal ini.</p>
                  )}
                </div>
              ) : (
                <p>Jadwal belum tersedia.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedkonfirmasi !== null && (
        <div id="konfirmasi" className="text-center">
          <div className="container">
            <div className="col-md-8 col-md-offset-2 section-title">
              <h2>
                <span>KONFIRMASI</span>
                <span>BOOKING</span>
              </h2>
            </div>
            <div id="tabel">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Hour</th>
                    <th>Worker</th>
                    <th>Service</th>
                    <th>Description</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules &&
                    services &&
                    schedules
                      .filter(
                        (schedule) =>
                          schedule.schedule_id === selectedkonfirmasi
                      )
                      .map((schedule) => {
                        const worker = workers.find(
                          (w) => w.user_id === schedule.worker_id
                        );
                        const service = services.find(
                          (s) => s.service_id === selectedServiceId
                        );
                        return (
                          <tr key={schedule.schedule_id}>
                            <td>{schedule.available_date}</td>
                            <td>{schedule.available_time_start}</td>
                            <td>{worker ? worker.name : "Unknown Worker"}</td>
                            <td>
                              {service
                                ? service.service_name
                                : "Unknown Service"}
                            </td>
                            <td>
                              {service ? service.description : "No Description"}
                            </td>
                            <td>
                              Rp{service ? service.price : "Unknown Price"}
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
            {services && (
              <button
                className="konfirmasi"
                onClick={() => {
                  const service = services.find(
                    (s) => s.service_id === selectedServiceId
                  );
                  const price = service ? service.price : 0; // Default price jika service tidak ditemukan
                  handleBooking(price);
                }}
              >
                Confirm Booking
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingList;
