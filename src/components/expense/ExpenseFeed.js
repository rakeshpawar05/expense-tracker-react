import React, { useEffect, useRef, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import { updateExpense, deleteExpense } from "../../api/expenseApi";

// A simple feed that groups expenses by date, provides a text filter,
// and triggers loadMore when scrolled near bottom.
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

  return (
    <>
      <div className="expense-feed" ref={containerRef} style={{ maxHeight: "60vh", overflowY: "auto" }}>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Filter loaded expenses"
            className="form-control"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        {sortedDates.length === 0 && (
          <div className="text-center text-muted">No expenses found.</div>
        )}

        {sortedDates.map((date) => (
          <div key={date} className="mb-4">
            <h5 className="fw-bold">{date}</h5>
            {grouped[date].map((e, index) => (
              <div
                key={`${date}-${e.id}-${index}`}
                className="d-flex justify-content-between align-items-center border-bottom py-2"
              >
                <div>
                  <div className="fw-semibold">{e.description}</div>
                  <div className="text-muted small">₹{Number(e.amount).toLocaleString("en-IN")}</div>
                </div>
                <div>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(e)}>
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(e.id)}
                    disabled={deletingId === e.id}
                  >
                    <FaTrash /> {deletingId === e.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}

        {hasMore && (
          <div className="text-center py-2">
            <button className="btn btn-outline-secondary" onClick={loadMore}>
              Load more
            </button>
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
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
