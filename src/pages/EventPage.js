import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { getEventsApi, createEventApi, deleteEventApi } from "../api/AxiosService";
import { useAuth } from "../Auth/AuthContext";
import ExpenseList from "../components/expense/ExpenseList";
import SavingList from "../components/saving/SavingList";

const EventPage = () => {
    const { userDetails} = useAuth();
    const [events, setEvents] = useState([]);
    const [viewExpense, setViewExpense] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [viewSaving, setViewSaving] = useState(false);
    const [savings, setSavings] = useState([]);
    const [displayId, setDisplayId] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            console.log("fetching events for user " + userDetails.userId)
            const response = await getEventsApi(userDetails.userId);
            setEvents(response.data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const handleAddEvent = async (values, { resetForm }) => {
        try {
            const response = await createEventApi({
                name: values.name,
                userId: userDetails.userId
            });
            console.log("events " + response.data)
            // setEvents([...events, response.data]);
            fetchEvents();
            resetForm();
        } catch (error) {
            console.error("Failed to add events:", error);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await deleteEventApi(eventId);
            setEvents(events.filter((event) => event.id !== eventId));
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Manage Event</h2>

            {/* Add Event Form */}
            <Formik
                initialValues={{ name: "" }}
                onSubmit={handleAddEvent}
            >
                {() => (
                    <Form className="row g-4">
                        <div className="form-group col-md-5">
                            {/* <label htmlFor="categoryName" className="form-label">Category Name</label> */}
                            <Field name="name" id="name" className="form-control" placeholder="Enter Event name" />
                        </div>
                        {/* <div className="form-group col-md-5">
                            {/* <label htmlFor="month" className="form-label">Select Month</label> }
                            <Field as="select" id="month" name="month" className="form-control">
                                <option value="">-- Select a month --</option>
                                {listOfAvailableMonths.map((month, index) => (
                                    <option key={index} value={month}>{month}</option>
                                ))}
                            </Field>
                        </div> */}
                        <div className="form-group col-md-2">
                            <button type="submit" className="btn btn-primary w-100">Add Event</button>
                        </div>
                    </Form>
                )}
            </Formik>

            {/* Category List
      <ul className="list-group mt-4">
        {categories.map((category) => (
          <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
            {category.name}
            {<button className="btn btn-danger btn-sm" onClick={() => handleDeleteCategory(category.id)}>Delete</button> }
          </li>
        ))}
      </ul> */}

            {/* Category Table */}
            <table className="table mt-4">
                <thead className="table-dark">
                    <tr>
                        <th>Event Name</th>
                        <th>Total Expense</th>
                        <th>Total Saving</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        events.length > 0 ? (
                            events.map((event) => (
                                <tr key={event.id}>
                                    <td>{event.name}</td>
                                    <td>₹{event.expenses ?
                                        event.expenses.reduce((acc, expense) => acc + Number(expense.amount), 0).toLocaleString("en-IN")
                                        : 0}</td>
                                        <td>₹{event.savings ?
                                        event.savings.reduce((acc, saving) => acc + Number(saving.amount), 0).toLocaleString("en-IN")
                                        : 0}</td>
                                    <td>
                                        {/* <button
                                    className="btn btn-primary btn-sm me-2"
                                // onClick={() => navigate(`/expenses/${category.id}`)}
                                >
                                    View Expenses
                                </button> */}

                                        <button
                                            className="btn btn-primary btn-sm me-2"
                                            onClick={() => {
                                                console.log(event.expenses)
                                                if (viewExpense && displayId === event.id ) {
                                                    setViewExpense(false)
                                                    setDisplayId(null)
                                                    // setExpenses([])
                                                } else {

                                                    setExpenses(
                                                        event.expenses ? event.expenses : []
                                                    );
                                                    setViewExpense(true)
                                                    setDisplayId(event.id)
                                                }
                                            }}
                                        >
                                            {(viewExpense && displayId === event.id) ? "Hide Expenses" : "View Expenses"}
                                        </button>

                                        <button
                                            className="btn btn-primary btn-sm me-2"
                                            onClick={() => {
                                                console.log(event.savings)
                                                if (viewSaving && displayId === event.id ) {
                                                    setViewSaving(false)
                                                    setDisplayId(null)
                                                    // setExpenses([])
                                                } else {

                                                    setSavings(
                                                        event.savings ? event.savings : []
                                                    );
                                                    setViewSaving(true)
                                                    setDisplayId(event.id)
                                                }
                                            }}
                                        >
                                            {(viewSaving && displayId === event.id) ? "Hide Savings" : "View Savings"}
                                        </button>

                                        {/* </td> */}
                                        {/* <td> */}
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleDeleteEvent(event.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )
                            )) :
                            <tr>
                                <td colSpan="3" className="text-center text-muted fw-bold">
                                    No events found.
                                </td>
                            </tr>
                    }
                </tbody>
            </table>

            {/* Render Expenses List for Selected Category */}
            {viewExpense && (
                expenses.length > 0 ? (<ExpenseList expenseList={expenses} />)
                    : <p className="alert alert-secondary text-center">No Expense to display</p>
            )}

            {/* Render Savings List for Selected Category */}
            {viewSaving && (
                savings.length > 0 ? (<SavingList savingList={savings} />)
                    : <p className="alert alert-secondary text-center">No Saving to display</p>
            )}
        </div>
    );
};

export default EventPage;