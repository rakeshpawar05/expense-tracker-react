import React, { useEffect, useRef, useState } from "react";
import { FaEdit, FaTrash, FaCalendar } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import { updateExpense, deleteExpense } from "../../api/expenseApi";
import "./../../styles/expensefeed.css";

const ExpenseFeed = ({ expenses, hasMore, loadMore, onExpenseUpdate, onExpenseDelete }) => {
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const containerRef = useRef(null);

  const filteredExpenses = expenses.filter((e) => {
    const desc = e?.description || "";
    return desc.toLowerCase().includes(filter.toLowerCase());
  });

  const grouped = filteredExpenses.reduce((acc, exp) => {
    const d = exp.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(exp);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      if (
        hasMore &&
        el.scrollHeight - el.scrollTop - el.clientHeight < 100
      ) {
        loadMore && loadMore();
      }
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [hasMore, loadMore]);

  const handleEdit = (expense) => {
    setSelectedExpense({ ...expense });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete expense?");
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteExpense(id);
      onExpenseDelete && onExpenseDelete(id);
    } catch (error) {
      console.error("Failed to delete expense", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = async () => {
    if (!selectedExpense) return;

    try {
      setSaving(true);
      await updateExpense(selectedExpense.id, selectedExpense);
      onExpenseUpdate && onExpenseUpdate(selectedExpense.id, selectedExpense);
      setShowModal(false);
    } catch (error) {
      console.error("Failed to update expense", error);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="expense-feed-container">
        <div className="expense-filter">
          <input
            type="text"
            placeholder="Filter loaded expenses"
            className="expense-filter-input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        {sortedDates.length === 0 && (
          <div className="no-expenses">
            <p>No expenses found.</p>
          </div>
        )}

        <div className="expense-list-wrapper">
          {sortedDates.map((date) => (
            <div key={date} className="expense-date-group">
              <div className="expense-date-header">
                <div className="date-info">
                  <FaCalendar className="date-icon" />
                  <span className="date-text">{formatDate(date)}</span>
                </div>
                <span className="expense-count">{grouped[date].length} Expenses</span>
              </div>

              <div className="expense-table">
                <div className="table-header">
                  <div className="table-col-description">DESCRIPTION</div>
                  <div className="table-col-amount">AMOUNT</div>
                  <div className="table-col-actions">ACTIONS</div>
                </div>

                {grouped[date].map((e, index) => (
                  <div
                    key={`${date}-${e.id}-${index}`}
                    className="table-row"
                  >
                    <div className="table-col-description">
                      <div className="expense-category-icon">🏪</div>
                      <span className="expense-description">{e.description}</span>
                    </div>
                    <div className="table-col-amount">
                      <span className="expense-amount">₹{Number(e.amount).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="table-col-actions">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => handleEdit(e)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(e.id)}
                        disabled={deletingId === e.id}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="load-more-section">
            <button className="btn-load-more" onClick={loadMore}>
              Load more
            </button>
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} contentClassName="expense-modal">
        <Modal.Header closeButton>
          <Modal.Title>Edit Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={selectedExpense?.description || ""}
                onChange={(e) =>
                  setSelectedExpense((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={selectedExpense?.amount || ""}
                onChange={(e) =>
                  setSelectedExpense((prev) => ({ ...prev, amount: Number(e.target.value) }))
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={selectedExpense?.date || ""}
                onChange={(e) =>
                  setSelectedExpense((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ExpenseFeed;

