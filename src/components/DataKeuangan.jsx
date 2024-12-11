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

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip);

const FinancialReports = () => {
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    expense: "",
    description: "",
    report_date: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/income`
        );
        setIncome(incomeResponse.data.data);

        const expenseResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/expense`
        );
        setExpense(expenseResponse.data.data);

        // Update charts
        updateBarChartData(
          incomeResponse.data.data,
          expenseResponse.data.data,
          ""
        );
        updatePieChartData(incomeResponse.data.data, expenseResponse.data.data);
      } catch (error) {
        console.error("Error fetching financial data:", error);
      }
    };

    fetchData();
  }, []);

  const updateBarChartData = (incomeData, expenseData, month) => {
    // Ambil semua tanggal dari income dan expense
    const allDates = [
      ...new Set([
        ...incomeData.map((income) => income.report_date),
        ...expenseData.map((expense) => expense.report_date),
      ]),
    ];

    // Filter tanggal berdasarkan bulan jika ada bulan yang dipilih
    const filteredDates = month
      ? allDates.filter((date) => date.startsWith(month)) // Gunakan .startsWith() untuk memfilter berdasarkan bulan
      : allDates;

    const incomeByDate = filteredDates.map((date) => {
      return incomeData
        .filter((income) => income.report_date === date) // Cocokkan tanggal
        .reduce((sum, income) => sum + parseFloat(income.income || 0), 0); // Hitung total income
    });

    const expenseByDate = filteredDates.map((date) => {
      return expenseData
        .filter((expense) => expense.report_date === date) // Cocokkan tanggal
        .reduce((sum, expense) => sum + parseFloat(expense.expense || 0), 0); // Hitung total expense
    });

    setBarChartData({
      labels: filteredDates, // Tampilkan tanggal yang sesuai
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

  const updatePieChartData = (incomeData, expenseData) => {
    const totalIncome = incomeData.reduce(
      (acc, item) => acc + parseFloat(item.income || 0),
      0
    );
    const totalExpense = expenseData.reduce(
      (acc, item) => acc + parseFloat(item.expense || 0),
      0
    );
    const netProfit = totalIncome - totalExpense;

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

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    console.log(month);
    updateBarChartData(income, expense, month);
  };

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

  return (
    <div id="keuangan">
      <h2>Financial Reports</h2>
      <div>
        <label htmlFor="month-select">
          <strong>Month:</strong>
        </label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={handleMonthChange}
          style={{border:"none",backgroundColor:"transparent",color:"#d7843e"}}
        >
          <option value="">All Data</option>
          {[
            ...new Set(
              [...income, ...expense].map((item) =>
                item.report_date.slice(0, 7)
              )
            ),
          ].map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Income Table */}
      <div id="table">
        <h3 style={{ textAlign: "center" }}>Income</h3>
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
              {income.map((item, index) => (
                <tr key={index}>
                  <td>{item.income}</td>
                  <td>{item.description}</td>
                  <td>{item.report_date}</td>
                </tr>
              ))}
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
              {expense.map((item, index) => (
                <tr key={index}>
                  <td>{item.expense}</td>
                  <td>{item.description}</td>
                  <td>{item.report_date}</td>
                </tr>
              ))}
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ flex: 1, maxWidth: "400px", marginLeft: "200px"}}>
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
