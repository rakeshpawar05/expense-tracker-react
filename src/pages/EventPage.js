import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { getEvents, createEvent, deleteEvent } from "../api/eventApi";
import { useAuth } from "../Auth/AuthContext";
import ExpenseFeed from "../components/expense/ExpenseFeed";
import SavingList from "../components/saving/SavingList";
import { FaPlus, FaTrash, FaEye } from "react-icons/fa";
import "./../styles/eventpage.css";

const EventPage = () => {
  const { userDetails } = useAuth();
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
      const response = await getEvents(userDetails.userId);
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const handleAddEvent = async (values, { resetForm }) => {
    try {
      await createEvent({
        name: values.name,
        userId: userDetails.userId
      });
      fetchEvents();
      resetForm();
    } catch (error) {
      console.error("Failed to add event:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const toggleExpenseView = (event) => {
    if (viewExpense && displayId === event.id) {
      setDisplayId(null);
      setViewExpense(false);
    } else {
      setViewExpense(true);
      setDisplayId(event.id);
      setExpenses(event.expenses || []);
    }
  };

  const toggleSavingView = (event) => {
    if (viewSaving && displayId === event.id) {
      setDisplayId(null);
      setViewSaving(false);
    } else {
      setViewSaving(true);
      setDisplayId(event.id);
      setSavings(event.savings || []);
    }
  };

  return (
    <div className="event-page">
      {/* Add Event Form */}
      <div className="add-form-card">
        <h3 className="form-title">Add New Event</h3>
        <Formik
          initialValues={{ name: "" }}
          onSubmit={handleAddEvent}
        >
          {() => (
            <Form className="event-form">
              <div className="form-group">
                <label>Event Name</label>
                <Field
                  name="name"
                  className="form-input"
                  placeholder="Enter event name"
                />
              </div>
              <button type="submit" className="btn-submit">
                <FaPlus /> Add Event
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Events Table */}
      <div className="events-table-card">
        {events.length > 0 ? (
          <div className="events-list">
            {events.map((event) => (
              <div key={event.id} className="event-item">
                <div className="event-info">
                  <h4 className="event-name">{event.name}</h4>
                  <div className="event-stats">
                    <div className="stat">
                      <span className="stat-label">Expenses</span>
                      <span className="stat-amount">
                        ₹
                        {event.expenses
                          ? event.expenses
                              .reduce((acc, expense) => acc + Number(expense.amount), 0)
                              .toLocaleString("en-IN")
                          : 0}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Savings</span>
                      <span className="stat-amount">
                        ₹
                        {event.savings
                          ? event.savings
                              .reduce((acc, saving) => acc + Number(saving.amount), 0)
                              .toLocaleString("en-IN")
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="event-actions">
                  <button
                    className="btn-action btn-view"
                    onClick={() => toggleExpenseView(event)}
                    title="View Expenses"
                  >
                    <FaEye />
                    {viewExpense && displayId === event.id ? "Hide" : "Expenses"}
                  </button>
                  <button
                    className="btn-action btn-view"
                    onClick={() => toggleSavingView(event)}
                    title="View Savings"
                  >
                    <FaEye />
                    {viewSaving && displayId === event.id ? "Hide" : "Savings"}
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => handleDeleteEvent(event.id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No events found. Create one to get started!</p>
          </div>
        )}
      </div>

      {/* Expenses List */}
      {viewExpense && displayId && (
        <div className="detail-section">
          <h3>Expenses for {events.find(e => e.id === displayId)?.name}</h3>
          {expenses.length > 0 ? (
            <ExpenseFeed expenses={expenses} hasMore={false} loadMore={() => {}} />
          ) : (
            <p className="empty-message">No expenses found.</p>
          )}
        </div>
      )}

      {/* Savings List */}
      {viewSaving && displayId && (
        <div className="detail-section">
          <h3>Savings for {events.find(e => e.id === displayId)?.name}</h3>
          {savings.length > 0 ? (
            <SavingList savingList={savings} fetch={false} />
          ) : (
            <p className="empty-message">No savings found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EventPage;