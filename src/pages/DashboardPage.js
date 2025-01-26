import React, { useState, useEffect } from "react";
import { getAmount } from "../api/AxiosService";

const DashboardPage = () => {

  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = 1; // Replace with the logged-in user's ID
    // const currentMonth = new Date().toISOString().slice(0, 7); // e.g., "2025-01"

    const fetchAmount = async () => {
      try {
        await getAmount(1).then((response) => {
          console.log("amount " + response.data)
          setAmount(response.data);
        })
      } catch (error) {
        console.error("Failed to fetch amount:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAmount();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Dashboard</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h4>Total Earnings</h4>
            <p>$5,000</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h4>Total Expenses</h4>
            <p>{amount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;