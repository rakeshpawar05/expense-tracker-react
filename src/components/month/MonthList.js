import React, { useEffect, useState } from "react";
import { getMonthsApi, updateMonthApi, deleteMonthApi } from "../../api/monthApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import { Field, Formik } from "formik";

const MonthList = () => {
    const { userDetails, setCurrentMonth } = useAuth();
    const navigate = useNavigate();
    const [months, setMonths] = useState([]);
    const [editMonthId, setEditMonthId] = useState(null);

    useEffect(() => {
        fetchMonths();
    }, []);

    const fetchMonths = async () => {
        try {
            console.log("Fetching months for userId " + userDetails.userId);
            const response = await getMonthsApi(userDetails.userId);
            setMonths(response.data);
            // setCurrentMonth(response.data.name);
        } catch (error) {
            console.error("Error fetching months:", error);
        }
    };

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
        try {
            await deleteMonthApi(id);
            setMonths(months.filter((month) => month.id !== id));
        } catch (error) {
            console.error("Failed to delete", error);
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

    return (
        <div className="container mt-4">
            <h4 className="mb-3 text-center">📅 Available Months</h4>
            <table className="table table-hover table-bordered shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th>Month</th>
                        <th>Earning</th>
                        <th>Expense</th>
                        <th>saving</th>
                        <th>Balance</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {months.length > 0 ? (
                        months.map((month) => (
                            <Formik
                                key={month.id}
                                initialValues={{
                                    earning: month.earning,
                                    expenses: month.expenses.reduce((acc, expense) => acc + Number(expense.amount), 0),
                                    savings: month.savings.reduce((acc, saving) => acc + Number(saving.amount), 0),
                                    balance: month.earning - month.expenses.reduce((acc, expense) => acc + Number(expense.amount), 0),
                                }}
                                onSubmit={(values) => {
                                    onUpdate(month.id, values);
                                    setEditMonthId(null);
                                }}
                            >
                                {({ handleSubmit }) => (
                                    <tr>
                                        <td>{month.name}</td>
                                        <td>
                                            {editMonthId === month.id ? (
                                                <Field type="number" name="earning" className="form-control" />
                                            ) : (
                                                `₹${month.earning ? month.earning.toLocaleString("en-IN") : 0}`
                                            )}
                                        </td>
                                        <td>₹{month.expenses.reduce((acc, expense) => acc + Number(expense.amount), 0).toLocaleString("en-IN")}</td>
                                        <td>₹{month.savings.reduce((acc, saving) => acc + Number(saving.amount), 0).toLocaleString("en-IN")}</td>
                                        <td>₹{(month.earning - month.expenses.reduce((acc, expense) => acc + Number(expense.amount), 0)).toLocaleString("en-IN")}</td>
                                        <td className="text-nowrap">
                                            <button className="btn btn-sm btn-primary me-2" onClick={() => goToExpenses(month)}>
                                                💰 View Expenses
                                            </button>
                                            <button className="btn btn-sm btn-primary me-2" onClick={() => goToSavings(month)}>
                                                💰 View Savings
                                            </button>
                                            {editMonthId === month.id ? (
                                                <>
                                                    <button type="button" className="btn btn-sm btn-success me-2" onClick={handleSubmit}>
                                                        ✅ Save
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-secondary" onClick={() => setEditMonthId(null)}>
                                                        ❌ Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className="btn btn-sm btn-warning me-2" onClick={() => setEditMonthId(month.id)}>
                                                        ✏️ Edit
                                                    </button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(month.id)}>
                                                        🗑️ Delete
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </Formik>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center text-muted">
                                No months available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MonthList;
