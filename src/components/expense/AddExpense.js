import React, { useState, useEffect } from "react";
import { createExpense } from "../../api/expenseApi";
import { getCategories } from "../../api/categoryApi";
import { getEvents } from "../../api/eventApi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAuth } from "../../Auth/AuthContext";
import { Modal, Button } from "react-bootstrap";

const AddExpense = ({ show = false, onHide = () => {}, onExpenseCreate = () => {} }) => {
    const { currentMonth, setCurrentMonth, userDetails } = useAuth();

    const monthList = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const [categories, setCategories] = useState([]);
    const [events, setEvents] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (show) {
            fetchCategories();
            fetchEvents();
        }
    }, [currentMonth, show]);

    const fetchCategories = async () => {
        try {
            const response = await getCategories(userDetails.userId, currentMonth);
            response.data.push({ name: "Add New" });
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch categories: ", error);
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await getEvents(userDetails.userId);
            setEvents(response.data);
        } catch (error) {
            console.error("Failed to fetch events: ", error);
        }
    };

    const handleAddExpense = async (values, { resetForm }) => {
        try {
            setSaving(true);
            const expenseMonthName = monthList[parseInt(values.date.toString().split('-')[1]) - 1] + "," +
                values.date.toString().split('-')[0];

            const expense = {
                description: values.name,
                amount: values.amount,
                date: values.date.toString(),
                monthName: expenseMonthName,
                categoryName: values.categoryName.trim(),
                eventName: values.eventName,
                userId: userDetails.userId
            };

            const response = await createExpense(expense);
            const result = response?.data;
            const createdExpense =
                result && typeof result === "object"
                    ? result
                    : {
                        ...expense,
                        id: result,
                    };

            if (onExpenseCreate) {
                onExpenseCreate(createdExpense);
            }

            resetForm();
            onHide();
        } catch (error) {
            console.error("Failed to add expense:", error);
            alert("Failed to add expense. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} contentClassName="expense-modal">
            <Modal.Header closeButton>
                <Modal.Title>Add New Expense</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{
                        "name": "",
                        "categoryName": "",
                        "eventName": "",
                        "amount": "",
                        "date": ""
                    }}
                    onSubmit={handleAddExpense}
                >
                    {({ values }) => (
                        <Form>
                            <div className="form-group mb-3">
                                <label className="form-label">Description</label>
                                <Field
                                    name="name"
                                    className="form-control"
                                    placeholder="Expense description"
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label">Category</label>
                                {values.categoryName === "" ? (
                                    <Field as="select" name="categoryName" className="form-control">
                                        <option value="">-- Select a category --</option>
                                        {categories.map((category, index) => (
                                            <option key={index} value={category.name}>
                                                {category.name}
                                            </option>
                                        ))}
                                        <option value="Add New">Add New</option>
                                    </Field>
                                ) : (
                                    <Field
                                        type="text"
                                        name="categoryName"
                                        className="form-control"
                                        placeholder={values.categoryName === "Add New" ? "Enter new category name" : "Category"}
                                    />
                                )}
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label">Event</label>
                                {values.eventName === "" ? (
                                    <Field as="select" name="eventName" className="form-control">
                                        <option value="">-- Select an event --</option>
                                        {events.map((event, index) => (
                                            <option key={index} value={event.name}>
                                                {event.name}
                                            </option>
                                        ))}
                                        <option value="Add New">Add New</option>
                                    </Field>
                                ) : (
                                    <Field
                                        type="text"
                                        name="eventName"
                                        className="form-control"
                                        placeholder={values.eventName === "Add New" ? "Enter new event name" : "Event"}
                                    />
                                )}
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label">Amount</label>
                                <Field
                                    name="amount"
                                    type="number"
                                    className="form-control"
                                    placeholder="Amount"
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label">Date</label>
                                <Field
                                    name="date"
                                    type="date"
                                    className="form-control"
                                />
                            </div>

                            <div className="modal-footer d-flex gap-2">
                                <Button variant="secondary" onClick={onHide}>
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit" disabled={saving}>
                                    {saving ? "Adding..." : "Add Expense"}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default AddExpense;