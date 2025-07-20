import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useAuth } from "../../Auth/AuthContext";
import { getSavingApi, updateSavingApi, deleteSavingApi } from "../../api/AxiosService";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa"; // Importing icons

const SavingList = ({ savingList, fetch }) => {
    const { currentMonth, userDetails } = useAuth();
    const [editingId, setEditingId] = useState(null);
    const [savings, setSavings] = useState(savingList);

    useEffect(() => {
        console.log("param" + fetch)
        if(fetch){
            fetchSavings();
        } else {
            console.log("not fetching savings...")
        }
    }, [])

    // useEffect(() => {
    const fetchSavings = async () => {
        try {
            console.log("fetching savings for month " + currentMonth);
            const params = {
                "monthName": currentMonth,
                "userId": userDetails.userId
            };
            const response = await getSavingApi(params);
            console.log("savings " + JSON.stringify(response.data));
            setSavings(response.data);
        } catch (error) {
            console.error("Failed to fetch savings", error);
        }
    };

    //     fetchExpenses();
    // }, [currentMonth]);

    const onUpdate = async (id, values) => {
        try {
            const updatedSaving = { ...values, id };
            await updateSavingApi(id, updatedSaving);
            setSavings((prev) =>
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
            await deleteSavingApi(id);
            setSavings((prevSavings) => prevSavings.filter((exp) => exp.id !== id));
            // expenses.filter((exp) => exp.id !== id)
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
