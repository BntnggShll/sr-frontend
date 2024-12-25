import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip);

const FinancialReports = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [filteredIncome, setFilteredIncome] = useState(income);
  const [selectedYear, setSelectedYear] = useState("");
  const [filteredData, setFilteredData] = useState([...income, ...expense]);
  const [searchIncomeDate, setSearchIncomeDate] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [filteredExpense, setFilteredExpense] = useState(expense);
  const [newExpense, setNewExpense] = useState({
    admin_id: "",
    expense: "",
    description: "",
    report_date: "",
  });
  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Mengambil token dari sessionStorage

    if (token) {
      try {
        const decoded = jwtDecode(token); // Mendekode token
        setNewExpense({
          ...newExpense,
          admin_id: decoded.user_id, // Mengatur admin_id berdasarkan user_id dari token
        });
      } catch (error) {
        console.error("Error decoding token", error);
        setError("Invalid token format or missing parts."); // Menangani error
        sessionStorage.removeItem("token");
      }
    } else {
      console.log("No token found");
    }
  }, [navigate, newExpense]); // Tambahkan newExpense ke dependency array

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/payments`
        );
        setIncome(incomeResponse.data);
        setFilteredIncome(incomeResponse.data);

        const expenseResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/expense`
        );
        setExpense(expenseResponse.data.data);
        setFilteredExpense(expenseResponse.data.data);

        // Update charts
        updateBarChartData(incomeResponse.data, expenseResponse.data.data, "");
        updatePieChartData(incomeResponse.data, expenseResponse.data.data);
      } catch (error) {
        console.error("Error fetching financial data:", error);
      }
    };

    fetchData();
  }, []);

  const handleExpenseModal = () => {
    setShowExpenseModal(!showExpenseModal);
  };

  const handleAddExpense = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/expense`, newExpense);
      setExpense((prev) => [...prev, newExpense]);
      setShowExpenseModal(false);
      setNewExpense({ expense: "", description: "", date: "" });
    } catch (error) {
      console.error("Error adding new expense:", error);
    }
  };

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    updateBarChartData(income, expense, month);
  };

  const updateBarChartData = (incomeData, expenseData, month, day) => {
    // Ambil semua tanggal dari income dan expense
    const allDates = [
      ...new Set([
        ...incomeData.map((income) => income.transaction_date),
        ...expenseData.map((expense) => expense.report_date),
      ]),
    ];

    // Filter tanggal berdasarkan bulan dan hari jika dipilih
    const filteredDates = allDates.filter((date) => {
      const matchesMonth = month ? date.startsWith(month) : true;
      const matchesDay = day
        ? new Date(date).toLocaleDateString("en-US", { weekday: "long" }) ===
          day
        : true;
      return matchesMonth && matchesDay;
    });

    const incomeByDate = filteredDates.map((date) => {
      return incomeData
        .filter((income) => income.transaction_date === date)
        .reduce((sum, income) => sum + parseFloat(income.amount || 0), 0);
    });

    const expenseByDate = filteredDates.map((date) => {
      return expenseData
        .filter((expense) => expense.report_date === date)
        .reduce((sum, expense) => sum + parseFloat(expense.expense || 0), 0);
    });

    setBarChartData({
      labels: filteredDates,
      datasets: [
        {
          label: "Total Income",
          data: incomeByDate,
          backgroundColor: "#d7843e",
        },
        {
          label: "Total Expense",
          data: expenseByDate,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    });
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchDate(searchValue);
    if (searchValue === "") {
      setFilteredExpense(expense);
    } else {
      const filtered = expense.filter((item) =>
        item.report_date.includes(searchValue)
      );
      setFilteredExpense(filtered);
    }
  };
  const handleIncomeSearch = (e) => {
    const searchValue = e.target.value;
    setSearchIncomeDate(searchValue);

    // Pastikan income memiliki data sebelum memfilter
    if (!income || income.length === 0) {
      setFilteredIncome([]);
      return;
    }

    if (searchValue === "") {
      setFilteredIncome(income); // Tampilkan semua data jika input kosong
    } else {
      const filtered = income.filter((item) =>
        item.transaction_date.includes(searchValue)
      );
      setFilteredIncome(filtered);
    }
  };

  const updatePieChartData = (incomeData, expenseData, year) => {
    let filteredIncome = incomeData;
    let filteredExpense = expenseData;

    if (year) {
      // Filter data berdasarkan tahun yang sama untuk income dan expense
      filteredIncome = incomeData.filter((item) =>
        item.transaction_date.startsWith(year)
      );
      filteredExpense = expenseData.filter((item) =>
        item.report_date.startsWith(year)
      );
    }

    // Menghitung total pendapatan dan pengeluaran setelah filter
    const totalIncome = filteredIncome.reduce(
      (acc, item) => acc + parseFloat(item.amount || 0),
      0
    );
    const totalExpense = filteredExpense.reduce(
      (acc, item) => acc + parseFloat(item.expense || 0),
      0
    );
    const netProfit = totalIncome - totalExpense;

    // Menyaring data yang sesuai dengan tahun yang dipilih
    setFilteredData([...filteredIncome, ...filteredExpense]);

    // Menyusun data untuk pie chart
    setPieChartData({
      labels: ["Net Profit", "Total Income", "Total Expense"],
      datasets: [
        {
          data: [netProfit, totalIncome, totalExpense],
          backgroundColor: ["#4bc0c0", "#36a2eb", "#ff6384"],
        },
      ],
    });
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    updatePieChartData(income, expense, year);
  };

  return (
    <div id="keuangan">
      <h2>Financial Reports</h2>

      {/* Income Table */}
      <div id="table">
        <h3 style={{ textAlign: "center" }}>Income</h3>
        <div style={{ margin: "10px 0", textAlign: "center" }}>
          <label htmlFor="search-date">
            <strong>Search by Date:</strong>
          </label>
          <input
            type="date"
            id="search-date"
            value={searchIncomeDate}
            onChange={handleIncomeSearch}
            style={{
              marginLeft: "10px",
              padding: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <div style={{ overflowY: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Income</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncome.length > 0 ? (
                filteredIncome.map((item, index) => (
                  <tr key={index}>
                    <td>{item.amount}</td>
                    <td>{item.payable.description}</td>
                    <td>{item.transaction_date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Expense Table */}
      <div id="table">
        <h3 style={{ textAlign: "center" }}>Expense</h3>
        <button
          onClick={handleExpenseModal}
          className="btn btn-primary"
          style={{
            marginLeft: "10px",
            backgroundColor: "#d7843e",
            border: "none",
          }}
        >
          Add Expense
        </button>

        {/* Input untuk pencarian berdasarkan tanggal */}
        <div style={{ margin: "10px 0", textAlign: "center" }}>
          <label htmlFor="search-date">
            <strong>Search by Date:</strong>
          </label>
          <input
            type="date"
            id="search-date"
            value={searchDate}
            onChange={handleSearch}
            style={{
              marginLeft: "10px",
              padding: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ overflowY: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Expense</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpense.map((item, index) => (
                <tr key={index}>
                  <td>{item.expense}</td>
                  <td>{item.description}</td>
                  <td>{item.report_date}</td>
                </tr>
              ))}
              {filteredExpense.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No data found for the selected date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal for Adding Expense */}
      {showExpenseModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Tambah Expense</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddExpense();
              }}
            >
              <div className="form-group">
                <label>Jumlah Expense:</label>
                <input
                  type="number"
                  className="form-control"
                  value={newExpense.expense}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, expense: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Deskripsi:</label>
                <input
                  type="text"
                  className="form-control"
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Tanggal:</label>
                <input
                  type="date"
                  className="form-control"
                  value={newExpense.report_date}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      report_date: e.target.value,
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
                  onClick={() => setShowExpenseModal(false)}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Charts */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginRight: "100px",
          marginLeft: "100px",
        }}
      >
        <div>
          <label htmlFor="month-select">
            <strong>Month:</strong>
          </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={handleMonthChange}
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: "#d7843e",
            }}
          >
            <option value="">All Data</option>
            {[
              // Gabungkan bulan dari `income` dan `expense`
              ...new Set([
                ...income.map((item) => item.transaction_date.slice(0, 7)), // Ambil bulan dari income
                ...expense.map((item) => item.report_date.slice(0, 7)), // Ambil bulan dari expense
              ]),
            ].map((month, index) => {
              // Konversi format YYYY-MM menjadi nama bulan
              const [year, monthNumber] = month.split("-");
              const monthName = new Date(year, monthNumber - 1).toLocaleString(
                "en-US",
                { month: "long" }
              );
              return (
                <option key={index} value={month}>
                  {monthName} {year}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label htmlFor="year-select">
            <strong>Year:</strong>
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={handleYearChange} // Fungsi untuk menangani perubahan
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: "#d7843e",
            }}
          >
            <option value="">All Data</option>
            {[
              // Gabungkan tahun dari `income` dan `expense`
              ...new Set([
                ...income.map((item) => item.transaction_date.slice(0, 4)), // Ambil tahun dari income
                ...expense.map((item) => item.report_date.slice(0, 4)), // Ambil tahun dari expense
              ]),
            ]
              .sort() // Urutkan tahun secara ascending
              .map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ flex: 1, maxWidth: "400px", marginLeft: "200px" }}>
          <h3>Bar Chart</h3>
          {barChartData ? (
            <Bar
              data={barChartData}
              options={{
                maintainAspectRatio: true,
                responsive: true,
                plugins: {
                  legend: { position: "top", labels: { font: { size: 10 } } },
                },
              }}
            />
          ) : (
            <p>Loading bar chart...</p>
          )}
        </div>
        <div style={{ flex: 1, maxWidth: "300px", marginRight: "200px" }}>
          <h3>Pie Chart</h3>
          {pieChartData && pieChartData.datasets[0].data.length > 0 ? (
            <Pie
              data={pieChartData}
              options={{
                maintainAspectRatio: true,
                responsive: true,
                plugins: {
                  legend: { position: "top", labels: { font: { size: 10 } } },
                },
              }}
            />
          ) : (
            <p>Loading pie chart...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;
