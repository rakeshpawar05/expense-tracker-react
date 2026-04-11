import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useAuth } from "../../Auth/AuthContext";
import { updateExpense, deleteExpense } from "../../api/expenseApi";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa"; // Importing icons

const ExpenseList = ({ expenseList }) => {
    const { currentMonth } = useAuth();
    const [editingId, setEditingId] = useState(null);
    const [expenses, setExpenses] = useState(expenseList);

    // keep internal state in sync when parent passes new list
    useEffect(() => {
        setExpenses(expenseList);
    }, [expenseList]);

    const onUpdate = async (id, values) => {
        try {
            const updatedExpense = { ...values, id };
            await updateExpense(id, updatedExpense);
            setExpenses((prev) =>
                prev.map((exp) => (exp.id === id ? { ...exp, ...values } : exp))
            );
            setEditingId(null);
        } catch (error) {
            console.error("Failed to update", error);
        }
    };

    //     fetchExpenses();
    // }, [currentMonth]);

    const onDelete = async (id) => {
        try {
            await deleteExpense(id);
            setExpenses((prevExpenses) => prevExpenses.filter((exp) => exp.id !== id));
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
