import React, { useState, useEffect } from "react";
import { getDashboardData } from "../api/dashboardApi";
import { getMonthNamesApi } from "../api/monthApi";
import { Formik, Form, Field } from "formik";
import { useAuth } from "../Auth/AuthContext";
import TopFiveExpenses from "../components/expense/TopFiveExpenses";
import { FaMoneyBillWave, FaShoppingCart, FaWallet, FaChevronDown } from "react-icons/fa";
import "./../styles/dashboardpage.css";

const DashboardPage = () => {
  const { userDetails, setCurrentMonth, currentMonth, setListOfAvailableMonths, listOfAvailableMonths } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ earnings: 0, expenses: 0, balance: 0 });
  const [spendingPercentage, setSpendingPercentage] = useState(0);

  useEffect(() => {
    const shouldLoad = currentMonth && userDetails?.userId;
    if (shouldLoad) {
      setLoading(true);
      fetchDetails({ month: currentMonth });
    }
  }, [currentMonth, userDetails?.userId]);

  const fetchDetails = async (values) => {
    try {
      const response = await getDashboardData({
        userId: userDetails.userId,
        monthName: values.month,
      });
      const data = response.data;
      if (data) {
        setSummary({
          earnings: data.totalEarning || 0,
          expenses: data.totalExpense || 0,
          balance: data.balance || 0,
        });
        const totalExpenses = data.totalExpense || 0;
        const totalEarnings = data.totalEarning || 0;
        setSpendingPercentage(
          totalEarnings > 0 ? (totalExpenses / totalEarnings) * 100 : 0
        );
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMonthNames = async () => {
      try {
        const response = await getMonthNamesApi(userDetails.userId);
        setListOfAvailableMonths(response.data);
      } catch (error) {
        console.error("Failed to fetch month names:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userDetails?.userId) {
      fetchMonthNames();
    }
  }, [userDetails?.userId]);

  return (
    <div className="dashboard-page">
      {/* Month Selector */}
      <div className="month-selector-card">
        <Formik
          initialValues={{ month: currentMonth || "" }}
          enableReinitialize
          onSubmit={(values) => {
            const selectedMonth = values.month || currentMonth;
            if (selectedMonth) {
              setCurrentMonth(selectedMonth);
              fetchDetails({ month: selectedMonth });
            }
          }}
        >
          {({ values, handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="month-selector-form">
              <label className="month-label">Select Month</label>
              <div className="month-selector-wrapper">
                <Field
                  as="select"
                  name="month"
                  className="month-select"
                >
                  <option value="">-- Select a month --</option>
                  {listOfAvailableMonths.map((month, index) => (
                    <option key={index} value={month}>
                      {month}
                    </option>
                  ))}
                </Field>
                <FaChevronDown className="select-icon" />
              </div>
              <button type="submit" className="btn-submit">
                View
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card earnings-card">
          <div className="card-icon">
            <FaMoneyBillWave />
          </div>
          <div className="card-content">
            <p className="card-label">Earnings</p>
            <p className="card-amount">₹{summary.earnings.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="summary-card expenses-card">
          <div className="card-icon">
            <FaShoppingCart />
          </div>
          <div className="card-content">
            <p className="card-label">Expenses</p>
            <p className="card-amount">₹{summary.expenses.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="summary-card balance-card">
          <div className="card-icon">
            <FaWallet />
          </div>
          <div className="card-content">
            <p className="card-label">Balance</p>
            <p className="card-amount">₹{summary.balance.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>

      {/* Spending Progress */}
      <div className="spending-card">
        <div className="spending-header">
          <h3 className="spending-title">Monthly Spending</h3>
          <p className="spending-subtitle">
            {spendingPercentage.toFixed(1)}% of your income is spent
          </p>
        </div>

        <div className="progress-container">
          <div className="progress-bar-wrapper">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min(spendingPercentage, 100)}%`,
              }}
            ></div>
          </div>
          <div className="progress-stats">
            <div className="stat">
              <span className="stat-label">Expenses</span>
              <span className="stat-value">₹{summary.expenses.toLocaleString("en-IN")}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Earnings</span>
              <span className="stat-value">₹{summary.earnings.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 Expenses */}
      <TopFiveExpenses />
    </div>
  );
};

export default DashboardPage;
