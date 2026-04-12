import React, { useState, useEffect } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { getTop5Expenses } from "../../api/expenseApi";
import { FaList } from "react-icons/fa";
import "./../../styles/topfiveexpenses.css";

const TopFiveExpenses = () => {
  const { currentMonth, userDetails } = useAuth();
  const [topExpenses, setTopExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (currentMonth !== "") {
        try {
          setLoading(true);
          const response = await getTop5Expenses(userDetails.userId, currentMonth);
          setTopExpenses(response.data || []);
        } catch (error) {
          console.log("Failed to get Top 5 expenses for " + currentMonth + " " + error);
          setTopExpenses([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchExpenses();
  }, [currentMonth, userDetails?.userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="top-expenses-card">
      <div className="card-header">
        <div className="header-title">
          <FaList className="header-icon" />
          <div>
            <h3 className="card-title">Top 5 Expenses</h3>
            <p className="card-subtitle">Your highest spending items this month</p>
          </div>
        </div>
      </div>

      <div className="card-body">
        {loading ? (
          <div className="loading-state">Loading expenses...</div>
        ) : topExpenses.length > 0 ? (
          <div className="expenses-table">
            <div className="table-header">
              <div className="col-date">DATE</div>
              <div className="col-description">DESCRIPTION</div>
              <div className="col-amount">AMOUNT</div>
            </div>

            {topExpenses.map((expense, index) => (
              <div key={index} className="table-row">
                <div className="col-date">
                  <span className="date-badge">{formatDate(expense.date)}</span>
                </div>
                <div className="col-description">
                  <p className="description-text">{expense.description}</p>
                </div>
                <div className="col-amount">
                  <span className="amount-text">₹{expense.amount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No expenses found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopFiveExpenses;