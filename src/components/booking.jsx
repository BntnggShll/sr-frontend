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
              (e) => e.status === "Available"
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
        axios.put(`${process.env.REACT_APP_API_URL}/points/${user.user_id}`);
        axios.put(
          `${process.env.REACT_APP_API_URL}/booked/${selectedkonfirmasi}`
        );
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
                    <svg
                      width="27"
                      height="27"
                      viewBox="0 0 27 27"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_224_58)">
                        <path
                          d="M20.2236 0.108798C20.5312 0.288098 20.7828 0.54709 20.9106 0.885394C20.991 1.26149 21.0153 1.71854 20.8029 2.05418C20.5098 2.45825 20.1373 2.80986 19.7845 3.16131C19.7401 3.20569 19.6958 3.25007 19.6501 3.2958C19.5286 3.41736 19.407 3.5388 19.2854 3.66019C19.1536 3.79172 19.022 3.92341 18.8904 4.05508C18.6628 4.28266 18.4352 4.51013 18.2075 4.73755C17.8783 5.06634 17.5492 5.39527 17.2201 5.72425C16.6862 6.2581 16.1521 6.79184 15.6179 7.3255C15.0993 7.84362 14.5808 8.36179 14.0623 8.88003C14.0303 8.91203 13.9983 8.94402 13.9653 8.97699C13.8047 9.13751 13.6441 9.29804 13.4835 9.45856C12.1532 10.7883 10.8228 12.1179 9.49215 13.4473C9.56613 13.6147 9.65336 13.7269 9.78281 13.8557C9.82143 13.8943 9.86006 13.933 9.89985 13.9729C9.94245 14.015 9.98505 14.0571 10.0289 14.1005C10.0741 14.1455 10.1192 14.1905 10.1657 14.2369C10.291 14.3619 10.4166 14.4866 10.5422 14.6112C10.6777 14.7457 10.8129 14.8805 10.9481 15.0152C11.1824 15.2487 11.417 15.4821 11.6516 15.7153C12.0227 16.0842 12.3932 16.4535 12.7636 16.8229C12.8904 16.9494 13.0172 17.0758 13.144 17.2022C13.1915 17.2496 13.1915 17.2496 13.24 17.2979C13.6008 17.6576 13.9616 18.0171 14.3225 18.3766C14.3555 18.4095 14.3885 18.4423 14.4225 18.4762C14.9568 19.0084 15.4914 19.5402 16.026 20.072C16.5752 20.6182 17.1238 21.1649 17.672 21.7121C18.01 22.0494 18.3484 22.3863 18.6874 22.7227C18.9198 22.9534 19.1518 23.1846 19.3834 23.4161C19.5169 23.5496 19.6506 23.6829 19.785 23.8156C19.9308 23.9597 20.0757 24.1048 20.2204 24.25C20.2627 24.2914 20.3049 24.3329 20.3484 24.3755C20.6572 24.6879 20.8914 25.0151 20.9705 25.4543C20.9651 25.9164 20.8995 26.2707 20.5851 26.6224C20.2159 26.9633 19.8861 27.0178 19.3953 27.0313C18.8593 26.9474 18.5044 26.611 18.1355 26.2374C18.0841 26.1863 18.0327 26.1353 17.9812 26.0844C17.8409 25.9452 17.7014 25.8052 17.5621 25.665C17.4113 25.5136 17.2598 25.363 17.1083 25.2123C16.8122 24.9173 16.5167 24.6216 16.2215 24.3256C15.9816 24.0851 15.7413 23.8448 15.5009 23.6046C15.4667 23.5704 15.4324 23.5362 15.3971 23.5009C15.3275 23.4314 15.2579 23.3619 15.1883 23.2924C14.5362 22.641 13.8849 21.9888 13.2338 21.3364C12.6755 20.7769 12.1165 20.2181 11.557 19.6598C10.9067 19.0109 10.2569 18.3617 9.60776 17.7117C9.53852 17.6424 9.46927 17.5731 9.40002 17.5037C9.34891 17.4526 9.34891 17.4526 9.29678 17.4004C9.05696 17.1603 8.81683 16.9206 8.57659 16.681C8.28376 16.3889 7.99141 16.0963 7.69965 15.8032C7.55086 15.6537 7.40186 15.5044 7.25228 15.3557C7.11523 15.2194 6.97881 15.0826 6.84286 14.9452C6.7705 14.8724 6.6975 14.8003 6.62447 14.7282C6.26818 14.3662 6.03414 14.0261 6.03475 13.5033C6.0336 13.4452 6.03244 13.3871 6.03125 13.3272C6.12141 12.7935 6.4537 12.4398 6.82707 12.0711C6.87813 12.0197 6.92914 11.9683 6.98009 11.9168C7.11929 11.7765 7.25928 11.6371 7.39944 11.4977C7.55082 11.3469 7.70145 11.1954 7.85217 11.0439C8.14716 10.7478 8.44286 10.4523 8.73881 10.1571C8.97938 9.91718 9.21968 9.67695 9.45981 9.43654C9.49403 9.40228 9.52825 9.36802 9.56351 9.33272C9.63303 9.26311 9.70256 9.1935 9.77208 9.12389C10.4234 8.47177 11.0756 7.82047 11.7281 7.16944C12.2876 6.61112 12.8464 6.05211 13.4047 5.4926C14.0535 4.84234 14.7028 4.19252 15.3527 3.54338C15.4221 3.47413 15.4914 3.40488 15.5607 3.33563C15.6119 3.28453 15.6119 3.28453 15.6641 3.23239C15.9041 2.99258 16.1439 2.75245 16.3835 2.51221C16.6756 2.21938 16.9681 1.92703 17.2613 1.63527C17.4108 1.48648 17.5601 1.33748 17.7088 1.1879C17.845 1.05085 17.9819 0.914433 18.1192 0.77848C18.192 0.706122 18.2642 0.633119 18.3363 0.560092C18.8627 0.0418701 19.5021 -0.219828 20.2236 0.108798Z"
                          fill="#D7843E"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_224_58">
                          <rect width="27" height="27" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                  <button
                    onClick={nextPageServices}
                    disabled={endIndexServices >= services.length}
                  >
                    <svg
                      width="27"
                      height="27"
                      viewBox="0 0 27 27"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_224_56)">
                        <path
                          d="M8.33189 0.263555C8.52184 0.41789 8.6925 0.588509 8.86436 0.762539C8.91573 0.813601 8.96715 0.864605 9.01863 0.915558C9.15892 1.05475 9.29838 1.19475 9.43771 1.33491C9.5885 1.48629 9.74005 1.63692 9.8915 1.78764C10.1877 2.08263 10.4831 2.37832 10.7783 2.67428C11.0183 2.91485 11.2585 3.15515 11.4989 3.39528C11.5332 3.4295 11.5674 3.46372 11.6027 3.49898C11.6723 3.5685 11.7419 3.63803 11.8116 3.70755C12.4637 4.35892 13.115 5.01108 13.766 5.66353C14.3243 6.22303 14.8833 6.78183 15.4428 7.34013C16.0931 7.98897 16.7429 8.63824 17.3921 9.28819C17.4613 9.35752 17.5306 9.42685 17.5998 9.49619C17.6339 9.5303 17.6679 9.5644 17.703 9.59955C17.9429 9.83959 18.183 10.0793 18.4232 10.319C18.7161 10.611 19.0084 10.9036 19.3002 11.1968C19.449 11.3462 19.598 11.4955 19.7475 11.6442C19.8846 11.7805 20.021 11.9173 20.157 12.0547C20.2293 12.1275 20.3023 12.1996 20.3753 12.2717C20.7316 12.6337 20.9657 12.9738 20.9651 13.4966C20.9662 13.5547 20.9674 13.6128 20.9686 13.6727C20.8784 14.2064 20.5461 14.5601 20.1728 14.9288C20.1217 14.9802 20.0707 15.0316 20.0197 15.0831C19.8805 15.2234 19.7405 15.3629 19.6004 15.5022C19.449 15.653 19.2984 15.8045 19.1477 15.956C18.8527 16.2521 18.557 16.5476 18.261 16.8428C18.0204 17.0827 17.7801 17.323 17.54 17.5634C17.5058 17.5976 17.4716 17.6319 17.4363 17.6672C17.3668 17.7368 17.2973 17.8064 17.2277 17.876C16.5764 18.5281 15.9242 19.1794 15.2718 19.8305C14.7123 20.3888 14.1535 20.9478 13.5952 21.5073C12.9463 22.1576 12.2971 22.8074 11.6471 23.4565C11.5778 23.5258 11.5084 23.595 11.4391 23.6643C11.405 23.6984 11.3709 23.7324 11.3357 23.7675C11.0957 24.0073 10.856 24.2475 10.6163 24.4877C10.3242 24.7805 10.0317 25.0729 9.73853 25.3646C9.58904 25.5134 9.43977 25.6624 9.29107 25.812C9.15481 25.9491 9.01795 26.0855 8.8806 26.2214C8.80781 26.2938 8.73566 26.3668 8.66355 26.4398C8.30159 26.7961 7.96152 27.0302 7.43871 27.0295C7.03961 27.0166 6.74108 26.9169 6.4419 26.6495C6.0974 26.2763 6.03288 25.9368 6.0466 25.437C6.11314 24.7709 6.76726 24.285 7.21534 23.8386C7.25968 23.7942 7.30402 23.7498 7.3497 23.7041C7.47118 23.5826 7.59279 23.4611 7.71445 23.3397C7.84621 23.2082 7.97782 23.0765 8.10945 22.9448C8.33699 22.7173 8.56464 22.4898 8.79235 22.2624C9.12157 21.9336 9.45064 21.6046 9.77968 21.2757C10.3137 20.7418 10.8477 20.2081 11.3819 19.6744C11.9005 19.1563 12.419 18.6381 12.9375 18.1199C12.9695 18.0879 13.0015 18.0559 13.0345 18.0229C13.1951 17.8624 13.3557 17.7019 13.5163 17.5414C14.8466 16.2116 16.1771 14.882 17.5077 13.5526C17.4337 13.3852 17.3465 13.273 17.217 13.1442C17.1591 13.0862 17.1591 13.0862 17.1 13.0271C17.0574 12.9849 17.0148 12.9428 16.9709 12.8994C16.9258 12.8544 16.8806 12.8094 16.8341 12.763C16.7088 12.638 16.5832 12.5133 16.4576 12.3887C16.3221 12.2542 16.187 12.1194 16.0518 11.9847C15.8174 11.7512 15.5829 11.5178 15.3482 11.2846C14.9772 10.9158 14.6066 10.5464 14.2362 10.177C14.1094 10.0505 13.9826 9.92413 13.8558 9.79771C13.8241 9.76612 13.7924 9.73453 13.7598 9.70197C13.3991 9.34233 13.0382 8.9828 12.6773 8.62332C12.6443 8.59046 12.6113 8.5576 12.5773 8.52374C12.0431 7.99156 11.5085 7.4597 10.9738 6.92791C10.4247 6.3817 9.87604 5.83498 9.32784 5.28783C8.98983 4.95051 8.6514 4.61361 8.31243 4.27726C8.07998 4.04654 7.84803 3.81535 7.61644 3.58378C7.48292 3.4503 7.34919 3.31704 7.21487 3.18436C7.069 3.04025 6.92416 2.89511 6.77941 2.74988C6.73716 2.70847 6.69491 2.66706 6.65138 2.62439C6.34259 2.31197 6.10838 1.98478 6.0293 1.54566C6.03475 1.08354 6.1003 0.72922 6.41471 0.377469C6.9823 -0.146555 7.69339 -0.12965 8.33189 0.263555Z"
                          fill="#D7843E"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_224_56">
                          <rect width="27" height="27" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
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
                <button onClick={backToServices} style={{ color: "#d7843e" }}>
                  Back to Services
                </button>
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
                  <svg
                    width="27"
                    height="27"
                    viewBox="0 0 27 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_224_58)">
                      <path
                        d="M20.2236 0.108798C20.5312 0.288098 20.7828 0.54709 20.9106 0.885394C20.991 1.26149 21.0153 1.71854 20.8029 2.05418C20.5098 2.45825 20.1373 2.80986 19.7845 3.16131C19.7401 3.20569 19.6958 3.25007 19.6501 3.2958C19.5286 3.41736 19.407 3.5388 19.2854 3.66019C19.1536 3.79172 19.022 3.92341 18.8904 4.05508C18.6628 4.28266 18.4352 4.51013 18.2075 4.73755C17.8783 5.06634 17.5492 5.39527 17.2201 5.72425C16.6862 6.2581 16.1521 6.79184 15.6179 7.3255C15.0993 7.84362 14.5808 8.36179 14.0623 8.88003C14.0303 8.91203 13.9983 8.94402 13.9653 8.97699C13.8047 9.13751 13.6441 9.29804 13.4835 9.45856C12.1532 10.7883 10.8228 12.1179 9.49215 13.4473C9.56613 13.6147 9.65336 13.7269 9.78281 13.8557C9.82143 13.8943 9.86006 13.933 9.89985 13.9729C9.94245 14.015 9.98505 14.0571 10.0289 14.1005C10.0741 14.1455 10.1192 14.1905 10.1657 14.2369C10.291 14.3619 10.4166 14.4866 10.5422 14.6112C10.6777 14.7457 10.8129 14.8805 10.9481 15.0152C11.1824 15.2487 11.417 15.4821 11.6516 15.7153C12.0227 16.0842 12.3932 16.4535 12.7636 16.8229C12.8904 16.9494 13.0172 17.0758 13.144 17.2022C13.1915 17.2496 13.1915 17.2496 13.24 17.2979C13.6008 17.6576 13.9616 18.0171 14.3225 18.3766C14.3555 18.4095 14.3885 18.4423 14.4225 18.4762C14.9568 19.0084 15.4914 19.5402 16.026 20.072C16.5752 20.6182 17.1238 21.1649 17.672 21.7121C18.01 22.0494 18.3484 22.3863 18.6874 22.7227C18.9198 22.9534 19.1518 23.1846 19.3834 23.4161C19.5169 23.5496 19.6506 23.6829 19.785 23.8156C19.9308 23.9597 20.0757 24.1048 20.2204 24.25C20.2627 24.2914 20.3049 24.3329 20.3484 24.3755C20.6572 24.6879 20.8914 25.0151 20.9705 25.4543C20.9651 25.9164 20.8995 26.2707 20.5851 26.6224C20.2159 26.9633 19.8861 27.0178 19.3953 27.0313C18.8593 26.9474 18.5044 26.611 18.1355 26.2374C18.0841 26.1863 18.0327 26.1353 17.9812 26.0844C17.8409 25.9452 17.7014 25.8052 17.5621 25.665C17.4113 25.5136 17.2598 25.363 17.1083 25.2123C16.8122 24.9173 16.5167 24.6216 16.2215 24.3256C15.9816 24.0851 15.7413 23.8448 15.5009 23.6046C15.4667 23.5704 15.4324 23.5362 15.3971 23.5009C15.3275 23.4314 15.2579 23.3619 15.1883 23.2924C14.5362 22.641 13.8849 21.9888 13.2338 21.3364C12.6755 20.7769 12.1165 20.2181 11.557 19.6598C10.9067 19.0109 10.2569 18.3617 9.60776 17.7117C9.53852 17.6424 9.46927 17.5731 9.40002 17.5037C9.34891 17.4526 9.34891 17.4526 9.29678 17.4004C9.05696 17.1603 8.81683 16.9206 8.57659 16.681C8.28376 16.3889 7.99141 16.0963 7.69965 15.8032C7.55086 15.6537 7.40186 15.5044 7.25228 15.3557C7.11523 15.2194 6.97881 15.0826 6.84286 14.9452C6.7705 14.8724 6.6975 14.8003 6.62447 14.7282C6.26818 14.3662 6.03414 14.0261 6.03475 13.5033C6.0336 13.4452 6.03244 13.3871 6.03125 13.3272C6.12141 12.7935 6.4537 12.4398 6.82707 12.0711C6.87813 12.0197 6.92914 11.9683 6.98009 11.9168C7.11929 11.7765 7.25928 11.6371 7.39944 11.4977C7.55082 11.3469 7.70145 11.1954 7.85217 11.0439C8.14716 10.7478 8.44286 10.4523 8.73881 10.1571C8.97938 9.91718 9.21968 9.67695 9.45981 9.43654C9.49403 9.40228 9.52825 9.36802 9.56351 9.33272C9.63303 9.26311 9.70256 9.1935 9.77208 9.12389C10.4234 8.47177 11.0756 7.82047 11.7281 7.16944C12.2876 6.61112 12.8464 6.05211 13.4047 5.4926C14.0535 4.84234 14.7028 4.19252 15.3527 3.54338C15.4221 3.47413 15.4914 3.40488 15.5607 3.33563C15.6119 3.28453 15.6119 3.28453 15.6641 3.23239C15.9041 2.99258 16.1439 2.75245 16.3835 2.51221C16.6756 2.21938 16.9681 1.92703 17.2613 1.63527C17.4108 1.48648 17.5601 1.33748 17.7088 1.1879C17.845 1.05085 17.9819 0.914433 18.1192 0.77848C18.192 0.706122 18.2642 0.633119 18.3363 0.560092C18.8627 0.0418701 19.5021 -0.219828 20.2236 0.108798Z"
                        fill="#D7843E"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_224_58">
                        <rect width="27" height="27" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
                <button
                  onClick={nextPageWorkers}
                  disabled={endIndexWorkers >= workers.length}
                >
                  <svg
                    width="27"
                    height="27"
                    viewBox="0 0 27 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_224_56)">
                      <path
                        d="M8.33189 0.263555C8.52184 0.41789 8.6925 0.588509 8.86436 0.762539C8.91573 0.813601 8.96715 0.864605 9.01863 0.915558C9.15892 1.05475 9.29838 1.19475 9.43771 1.33491C9.5885 1.48629 9.74005 1.63692 9.8915 1.78764C10.1877 2.08263 10.4831 2.37832 10.7783 2.67428C11.0183 2.91485 11.2585 3.15515 11.4989 3.39528C11.5332 3.4295 11.5674 3.46372 11.6027 3.49898C11.6723 3.5685 11.7419 3.63803 11.8116 3.70755C12.4637 4.35892 13.115 5.01108 13.766 5.66353C14.3243 6.22303 14.8833 6.78183 15.4428 7.34013C16.0931 7.98897 16.7429 8.63824 17.3921 9.28819C17.4613 9.35752 17.5306 9.42685 17.5998 9.49619C17.6339 9.5303 17.6679 9.5644 17.703 9.59955C17.9429 9.83959 18.183 10.0793 18.4232 10.319C18.7161 10.611 19.0084 10.9036 19.3002 11.1968C19.449 11.3462 19.598 11.4955 19.7475 11.6442C19.8846 11.7805 20.021 11.9173 20.157 12.0547C20.2293 12.1275 20.3023 12.1996 20.3753 12.2717C20.7316 12.6337 20.9657 12.9738 20.9651 13.4966C20.9662 13.5547 20.9674 13.6128 20.9686 13.6727C20.8784 14.2064 20.5461 14.5601 20.1728 14.9288C20.1217 14.9802 20.0707 15.0316 20.0197 15.0831C19.8805 15.2234 19.7405 15.3629 19.6004 15.5022C19.449 15.653 19.2984 15.8045 19.1477 15.956C18.8527 16.2521 18.557 16.5476 18.261 16.8428C18.0204 17.0827 17.7801 17.323 17.54 17.5634C17.5058 17.5976 17.4716 17.6319 17.4363 17.6672C17.3668 17.7368 17.2973 17.8064 17.2277 17.876C16.5764 18.5281 15.9242 19.1794 15.2718 19.8305C14.7123 20.3888 14.1535 20.9478 13.5952 21.5073C12.9463 22.1576 12.2971 22.8074 11.6471 23.4565C11.5778 23.5258 11.5084 23.595 11.4391 23.6643C11.405 23.6984 11.3709 23.7324 11.3357 23.7675C11.0957 24.0073 10.856 24.2475 10.6163 24.4877C10.3242 24.7805 10.0317 25.0729 9.73853 25.3646C9.58904 25.5134 9.43977 25.6624 9.29107 25.812C9.15481 25.9491 9.01795 26.0855 8.8806 26.2214C8.80781 26.2938 8.73566 26.3668 8.66355 26.4398C8.30159 26.7961 7.96152 27.0302 7.43871 27.0295C7.03961 27.0166 6.74108 26.9169 6.4419 26.6495C6.0974 26.2763 6.03288 25.9368 6.0466 25.437C6.11314 24.7709 6.76726 24.285 7.21534 23.8386C7.25968 23.7942 7.30402 23.7498 7.3497 23.7041C7.47118 23.5826 7.59279 23.4611 7.71445 23.3397C7.84621 23.2082 7.97782 23.0765 8.10945 22.9448C8.33699 22.7173 8.56464 22.4898 8.79235 22.2624C9.12157 21.9336 9.45064 21.6046 9.77968 21.2757C10.3137 20.7418 10.8477 20.2081 11.3819 19.6744C11.9005 19.1563 12.419 18.6381 12.9375 18.1199C12.9695 18.0879 13.0015 18.0559 13.0345 18.0229C13.1951 17.8624 13.3557 17.7019 13.5163 17.5414C14.8466 16.2116 16.1771 14.882 17.5077 13.5526C17.4337 13.3852 17.3465 13.273 17.217 13.1442C17.1591 13.0862 17.1591 13.0862 17.1 13.0271C17.0574 12.9849 17.0148 12.9428 16.9709 12.8994C16.9258 12.8544 16.8806 12.8094 16.8341 12.763C16.7088 12.638 16.5832 12.5133 16.4576 12.3887C16.3221 12.2542 16.187 12.1194 16.0518 11.9847C15.8174 11.7512 15.5829 11.5178 15.3482 11.2846C14.9772 10.9158 14.6066 10.5464 14.2362 10.177C14.1094 10.0505 13.9826 9.92413 13.8558 9.79771C13.8241 9.76612 13.7924 9.73453 13.7598 9.70197C13.3991 9.34233 13.0382 8.9828 12.6773 8.62332C12.6443 8.59046 12.6113 8.5576 12.5773 8.52374C12.0431 7.99156 11.5085 7.4597 10.9738 6.92791C10.4247 6.3817 9.87604 5.83498 9.32784 5.28783C8.98983 4.95051 8.6514 4.61361 8.31243 4.27726C8.07998 4.04654 7.84803 3.81535 7.61644 3.58378C7.48292 3.4503 7.34919 3.31704 7.21487 3.18436C7.069 3.04025 6.92416 2.89511 6.77941 2.74988C6.73716 2.70847 6.69491 2.66706 6.65138 2.62439C6.34259 2.31197 6.10838 1.98478 6.0293 1.54566C6.03475 1.08354 6.1003 0.72922 6.41471 0.377469C6.9823 -0.146555 7.69339 -0.12965 8.33189 0.263555Z"
                        fill="#D7843E"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_224_56">
                        <rect width="27" height="27" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
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
          <button onClick={backToWorkers} style={{ color: "#d7843e" }}>
            Back to Workers
          </button>
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
