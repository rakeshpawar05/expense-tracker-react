import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useAuth } from "../../Auth/AuthContext";
import { updateSaving, deleteSaving } from "../../api/savingApi";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa"; // Importing icons

const SavingList = ({ savingList }) => {
    const [editingId, setEditingId] = useState(null);
    const [savings, setSavings] = useState(savingList);

    useEffect(() => {
        setSavings(savingList);
    }, [savingList]);

    //     fetchExpenses();
    // }, [currentMonth]);

    const onUpdate = async (id, values) => {
        try {
            const updatedSaving = { ...values, id };
            await updateSaving(id, updatedSaving);
            setSavings((prev) =>
                prev.map((exp) => (exp.id === id ? { ...exp, ...values } : exp))
            );
            setEditingId(null);
        } catch (error) {
            console.error("Failed to update", error);
        }
    };

    const onDelete = async (id) => {
        try {
            await deleteSaving(id);
            setSavings((prevSavings) => prevSavings.filter((exp) => exp.id !== id));
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    return (
        <div className="container mt-3">
            <h3 className="text-center">Savings</h3>

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
                        {savings.length > 0 ? (
                            savings.map((saving) => (
                                <Formik
                                    key={saving.id}
                                    initialValues={{ description: saving.description, amount: saving.amount, date: saving.date }}
                                    onSubmit={(values) => onUpdate(saving.id, values)}
                                >
                                    {({ handleSubmit }) => (
                                        <tr>
                                            <td>{saving.date}</td>
                                            <td>
                                                {editingId === saving.id ? (
                                                    <Field type="text" name="description" className="form-control" />
                                                ) : (
                                                    saving.description
                                                )}
                                            </td>
                                            <td>
                                                {editingId === saving.id ? (
                                                    <Field type="number" name="amount" className="form-control" />
                                                ) : (
                                                    `₹${saving.amount.toLocaleString("en-IN")}`
                                                )}
                                            </td>
                                            <td>
                                                {editingId === saving.id ? (
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
                                                            onClick={() => setEditingId(saving.id)}
                                                        >
                                                            <FaEdit /> Edit
                                                        </button>
                                                        <button className="btn btn-danger btn-sm" onClick={() => onDelete(saving.id)}>
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
                                    No savings found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SavingList;
