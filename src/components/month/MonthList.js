import React, { useEffect, useState, useMemo } from "react";
import { getMonthsApi, updateMonthApi, deleteMonthApi } from "../../api/monthApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import { Field, Formik } from "formik";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaCalendarCheck } from "react-icons/fa";
import "./../../styles/monthlist.css";

const MonthList = () => {
    const { userDetails, setCurrentMonth } = useAuth();
    const navigate = useNavigate();
    const [months, setMonths] = useState([]);
    const [editMonthId, setEditMonthId] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    useEffect(() => {
        fetchMonths();
    }, []);

    const fetchMonths = async () => {
        try {
            console.log("Fetching months for userId " + userDetails.userId);
            const response = await getMonthsApi(userDetails.userId);
            setMonths(response.data);
            
            // Set default year to the latest year
            if (response.data.length > 0) {
                const years = extractYears(response.data);
                const latestYear = Math.max(...years);
                setSelectedYear(latestYear);
            }
        } catch (error) {
            console.error("Error fetching months:", error);
        }
    };

    const extractYears = (monthsList) => {
        const years = new Set();
        monthsList.forEach((month) => {
            const year = parseInt(month.name.split(",")[1]);
            years.add(year);
        });
        return Array.from(years).sort((a, b) => b - a);
    };

    const availableYears = useMemo(() => extractYears(months), [months]);

    const filteredMonths = useMemo(() => {
        if (!selectedYear) return months;
        return months.filter((month) => {
            const year = parseInt(month.name.split(",")[1]);
            return year === selectedYear;
        });
    }, [months, selectedYear]);

    const onUpdate = (id, values) => {
        const updatedMonths = months.map((month) =>
            month.id === id ? { ...month, earning: values.earning } : month
        );
        setMonths(updatedMonths);
        updateMonth({ ...months.find((m) => m.id === id), earning: values.earning });
    };

    const updateMonth = async (month) => {
        try {
            await updateMonthApi(month.id, month);
        } catch (error) {
            console.error("Failed to update month", error);
        }
    };

    const onDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this month?")) {
            try {
                await deleteMonthApi(id);
                setMonths(months.filter((month) => month.id !== id));
            } catch (error) {
                console.error("Failed to delete", error);
                alert("Failed to delete month. Please try again.");
            }
        }
    };

    const goToExpenses = (month) => {
        setCurrentMonth(month.name);
        navigate(`/expenses`);
    };

    const goToSavings = (month) => {
        setCurrentMonth(month.name);
        navigate(`/savings`);
    };

    const totalExpenses = (month) => month.expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
    const totalSavings = (month) => month.savings.reduce((acc, saving) => acc + Number(saving.amount), 0);
    const balance = (month) => month.earning - totalExpenses(month);

    return (
        <div className="month-list-container">
            {months.length > 0 && (
                <div className="year-filter-section">
                    <label className="year-filter-label">Select Year:</label>
                    <div className="year-filter-buttons">
                        {availableYears.sort((a, b) => a - b).map((year) => (
                            <button
                                key={year}
                                className={`year-btn ${selectedYear === year ? "active" : ""}`}
                                onClick={() => setSelectedYear(year)}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {filteredMonths.length > 0 ? (
                <div className="month-grid">
                    {filteredMonths.map((month) => (
                        <Formik
                            key={month.id}
                            initialValues={{
                                earning: month.earning,
                                expenses: totalExpenses(month),
                                savings: totalSavings(month),
                                balance: balance(month),
                            }}
                            onSubmit={(values) => {
                                onUpdate(month.id, values);
                                setEditMonthId(null);
                            }}
                        >
                            {({ handleSubmit }) => (
                                <div className="month-card">
                                    <div className="month-card-header">
                                        <div className="month-name">
                                            <span className="month-icon">📅</span>
                                            {month.name}
                                        </div>
                                    </div>

                                    <div className="month-card-body">
                                        <div className="month-stat">
                                            <span className="month-stat-label">Earning</span>
                                            <span className="month-stat-value earning">
                                                {editMonthId === month.id ? (
                                                    <Field type="number" name="earning" className="month-edit-input" />
                                                ) : (
                                                    `₹${month.earning ? month.earning.toLocaleString("en-IN") : 0}`
                                                )}
                                            </span>
                                        </div>

                                        <div className="month-stat">
                                            <span className="month-stat-label">Expense</span>
                                            <span className="month-stat-value expense">
                                                ₹{totalExpenses(month).toLocaleString("en-IN")}
                                            </span>
                                        </div>

                                        <div className="month-stat">
                                            <span className="month-stat-label">Saving</span>
                                            <span className="month-stat-value saving">
                                                ₹{totalSavings(month).toLocaleString("en-IN")}
                                            </span>
                                        </div>

                                        <div className="month-stat">
                                            <span className="month-stat-label">Balance</span>
                                            <span className="month-stat-value balance">
                                                ₹{balance(month).toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="month-card-actions">
                                        <div className="month-card-actions-primary">
                                            <button 
                                                type="button"
                                                className="btn-view" 
                                                onClick={() => goToExpenses(month)}
                                                title="View Expenses"
                                            >
                                                <FaCalendarCheck /> Expenses
                                            </button>
                                            <button 
                                                type="button"
                                                className="btn-view" 
                                                onClick={() => goToSavings(month)}
                                                title="View Savings"
                                            >
                                                <FaCalendarCheck /> Savings
                                            </button>
                                        </div>

                                        <div className="month-card-actions-secondary">
                                            {editMonthId === month.id ? (
                                                <>
                                                    <button 
                                                        type="button" 
                                                        className="btn-save-month" 
                                                        onClick={handleSubmit}
                                                        title="Save"
                                                    >
                                                        <FaCheck /> Save
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="btn-cancel" 
                                                        onClick={() => setEditMonthId(null)}
                                                        title="Cancel"
                                                    >
                                                        <FaTimes /> Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button 
                                                        type="button"
                                                        className="btn-edit-month" 
                                                        onClick={() => setEditMonthId(month.id)}
                                                        title="Edit"
                                                    >
                                                        <FaEdit /> Edit
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        className="btn-delete-month" 
                                                        onClick={() => onDelete(month.id)}
                                                        title="Delete"
                                                    >
                                                        <FaTrash /> Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Formik>
                    ))}
                </div>
            ) : months.length > 0 ? (
                <div className="no-months">
                    <p>📭 No months available for the selected year.</p>
                </div>
            ) : (
                <div className="no-months">
                    <p>📭 No months available. Create one to get started!</p>
                </div>
            )}
        </div>
    );
};

export default MonthList;
