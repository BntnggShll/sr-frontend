import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";

const BookingList = () => {
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
    // Ambil data services
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
        setSchedules(response.data.schedule);
      })
      .catch((error) => {
        console.error("Error fetching schedules", error);
      });
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

  const handleServiceClick = (serviceId) => {
    setSelectedServiceId(serviceId);
  };

  const handleWorkerClick = (user_id) => {
    setSelectedWorkerId(user_id);
    console.log(user_id);
  };

  const handleKonfirmasi = (schedule_id) => {
    setSelectedkonfirmasi(schedule_id);
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

  // Fungsi untuk menangani klik pada tanggal di kalender
  const handleDateClick = (date) => {
    setSelectedDate(date); // Menyimpan tanggal yang dipilih
    const formattedDate = date.toISOString().split("T")[0]; // Format tanggal menjadi YYYY-MM-DD

    // Mencari jadwal yang sesuai dengan worker dan tanggal yang dipilih
    const availableSchedule = schedules.find(
      (schedule) =>
        schedule.worker_id === selectedWorkerId &&
        schedule.available_date === formattedDate &&
        schedule.status === "Available"
    );

    if (availableSchedule) {
      setSelectedSchedule(availableSchedule); // Menyimpan jadwal yang dipilih
    } else {
      setSelectedSchedule(null); // Tidak ada jadwal yang tersedia
    }
  };

  const filterFutureDates = (date) => {
    return date >= new Date(); // Menampilkan hanya tanggal yang lebih besar atau sama dengan hari ini
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
          <div className="container">
            <div className="col-md-8 col-md-offset-2 section-title">
              <h2>
                <span>PILIH</span>
                <span>JADWAL</span>
              </h2>
              <button onClick={backToWorkers}>Back to Workers</button>
            </div>
            <div>
              <Calendar
                minDate={new Date()} // Menetapkan batas tanggal minimum pada hari ini
                tileDisabled={({ date }) => !filterFutureDates(date)} // Menonaktifkan tanggal yang sudah lewat
                onClickDay={handleDateClick} // Menangani klik tanggal
              />
            </div>

            {/* Tampilkan informasi jadwal jika ada */}
            {selectedSchedule ? (
              <div>
                {currentjadwal.length > 0 ? (
                  currentjadwal.map((jadwal) => (
                    <p key={jadwal.schedule_id}>
                      <button
                        onClick={() => handleKonfirmasi(jadwal.schedule_id)}
                      >
                        Start Time: {jadwal.available_time_start}
                      </button>
                    </p>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingList;
