import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useAuth } from "../../Auth/AuthContext";
import { getExpenseApi, updateExpenseApi, deleteExpenseApi } from "../../api/AxiosService";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa"; // Importing icons

const ExpenseList = ({ expenseList, fetch }) => {
    const { currentMonth, userDetails } = useAuth();
    const [editingId, setEditingId] = useState(null);
    const [expenses, setExpenses] = useState(expenseList);

    useEffect(() => {
        console.log("param" + fetch)
        if(fetch){
            fetchExpenses();
        } else {
            console.log("not fetching expenses...")
        }
    }, [])

    // useEffect(() => {
    const fetchExpenses = async () => {
        try {
            console.log("fetching expenses for month " + currentMonth);
            const params = {
                "monthName": currentMonth,
                "userId": userDetails.userId
            };
            const response = await getExpenseApi(params);
            console.log("expenses " + JSON.stringify(response.data));
            setExpenses(response.data);
        } catch (error) {
            console.error("Failed to fetch expenses", error);
        }
    };

    //     fetchExpenses();
    // }, [currentMonth]);

    const onUpdate = async (id, values) => {
        try {
            const updatedExpense = { ...values, id };
            await updateExpenseApi(id, updatedExpense);
            setExpenses((prev) =>
                prev.map((exp) => (exp.id === id ? { ...exp, ...values } : exp))
            );
            // expenses.map((exp) => (exp.id === id ? { ...exp, ...values } : exp))
            setEditingId(null);
        } catch (error) {
            console.error("Failed to update", error);
        }
    };

    const onDelete = async (id) => {
        try {
            await deleteExpenseApi(id);
            setExpenses((prevExpenses) => prevExpenses.filter((exp) => exp.id !== id));
            // expenses.filter((exp) => exp.id !== id)
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    return (
        <div className="container mt-3">
            <h3 className="text-center">Expenses</h3>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.length > 0 ? (
                            expenses.map((expense) => (
                                <Formik
                                    key={expense.id}
                                    initialValues={{ description: expense.description, amount: expense.amount, date: expense.date }}
                                    onSubmit={(values) => onUpdate(expense.id, values)}
                                >
                                    {({ handleSubmit }) => (
                                        <tr>
                                            <td>{expense.date}</td>
                                            <td>
                                                {editingId === expense.id ? (
                                                    <Field type="text" name="description" className="form-control" />
                                                ) : (
                                                    expense.description
                                                )}
                                            </td>
                                            <td>
                                                {editingId === expense.id ? (
                                                    <Field type="number" name="amount" className="form-control" />
                                                ) : (
                                                    `₹${expense.amount.toLocaleString("en-IN")}`
                                                )}
                                            </td>
                                            <td>
                                                {editingId === expense.id ? (
                                                    <>
                                                        <button type="button" className="btn btn-success btn-sm me-2" onClick={handleSubmit}>
                                                            <FaSave /> Save
                                                        </button>
                                                        <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>
                                                            <FaTimes /> Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="btn btn-warning btn-sm me-2"
                                                            onClick={() => setEditingId(expense.id)}
                                                        >
                                                            <FaEdit /> Edit
                                                        </button>
                                                        <button className="btn btn-danger btn-sm" onClick={() => onDelete(expense.id)}>
                                                            <FaTrash /> Delete
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </Formik>
                            ))) : (
                            <tr>
                                <td colSpan="4" className="text-center text-muted fw-bold">
                                    No expenses found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExpenseList;
