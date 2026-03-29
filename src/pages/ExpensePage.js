import React, { useState, useEffect } from "react";
import AddExpense from "../components/expense/AddExpense";
import ExpenseFeed from "../components/expense/ExpenseFeed";
import { useAuth } from "../Auth/AuthContext";
import { getExpenses } from "../api/expenseApi";
import { getMonthNamesApi } from "../api/monthApi";

const ExpensesPage = () => {

  const { currentMonth, setCurrentMonth, userDetails } = useAuth();

  const [toggleView, setToggleView] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [infoMessage, setInfoMessage] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [description, setDescription] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [cursor, setCursor] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState({
    monthName: currentMonth,
    description: "",
    fromDate: "",
    toDate: "",
  });

  const handleOnClick = () => {
    const next = !toggleView;
    setToggleView(next);
    setInfoMessage("");
    // refresh list whenever switching to view mode to keep data fresh
    if (next) {
      setExpenses([]);
      setCursor(null);
      setHasMore(true);
      fetchExpenses(appliedFilters, null);
    }
  };

  const fetchExpenses = async (filters = appliedFilters, cursorValue = null) => {
    try {
      const params = {
        userId: userDetails.userId,
        categoryName: filters.categoryName || undefined,
        expenseName: filters.description || undefined,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        limit: 20,
        cursor: cursorValue || undefined,
      };

      if (!filters.fromDate && !filters.toDate) {
        params.monthName = filters.monthName || currentMonth || undefined;
      }

      const response = await getExpenses(params);
      const payload = response.data || {};
      const items = Array.isArray(payload.items)
        ? payload.items
        : Array.isArray(response.data)
        ? response.data
        : [];
      const nextCursor = payload.nextCursor || null;
      const hasMore =
        typeof payload.hasMore === "boolean"
          ? payload.hasMore
          : !!nextCursor;

      const dedupedItems = items.filter(
        (item, index, self) =>
          self.findIndex((other) => other.id === item.id) === index
      );

      setExpenses((prev) => {
        if (!cursorValue) {
          return dedupedItems;
        }

        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = dedupedItems.filter((item) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });
      setCursor(nextCursor);
      setHasMore(hasMore);
    } catch (error) {
      console.error("Failed to fetch expenses", error);
    }
  };

  useEffect(() => {
    const initialMonth = currentMonth || "";
    setSelectedMonth(initialMonth);
    setAppliedFilters((prev) => ({
      ...prev,
      monthName: initialMonth,
    }));
  }, [currentMonth]);

  useEffect(() => {
    const loadMonths = async () => {
      if (!userDetails?.userId) return;
      try {
        const response = await getMonthNamesApi(userDetails.userId);
        setAvailableMonths(response.data || []);
      } catch (error) {
        console.error("Failed to load month names", error);
      }
    };

    loadMonths();
  }, [userDetails?.userId]);

  useEffect(() => {
    if (!userDetails?.userId) return;
    setExpenses([]);
    setCursor(null);
    setHasMore(true);
    fetchExpenses(appliedFilters, null);
    setToggleView(true);
  }, [appliedFilters, userDetails?.userId]);

  const handleApplyFilters = () => {
    const usingDateRange = Boolean(fromDate || toDate);
    const monthName = usingDateRange ? "" : selectedMonth || currentMonth;
    const nextFilters = {
      monthName,
      description,
      fromDate,
      toDate,
    };
    setAppliedFilters(nextFilters);
    if (!usingDateRange && monthName && monthName !== currentMonth) {
      setCurrentMonth(monthName);
    }
  };

  const handleResetFilters = () => {
    const monthName = currentMonth || "";
    setSelectedMonth(monthName);
    setDescription("");
    setFromDate("");
    setToDate("");
    setAppliedFilters({ monthName, description: "", fromDate: "", toDate: "" });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-3">
        <h1 className="m-0">Expenses</h1>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="card mb-4 p-3 shadow-sm">
          <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Month</label>
            <select
              className="form-select"
              value={selectedMonth || ""}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">Select month</option>
              {(availableMonths.length ? availableMonths : [currentMonth]).map((month, index) => (
                month && <option key={index} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">From</label>
            <input
              type="date"
              className="form-control"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">To</label>
            <input
              type="date"
              className="form-control"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="col-md-2 d-flex gap-2">
            <button className="btn btn-primary w-100" onClick={handleApplyFilters}>
              Apply Filters
            </button>
            <button className="btn btn-outline-secondary w-100" onClick={handleResetFilters}>
              Reset
            </button>
          </div>
        </div>
        </div>
      )}

      <div className="row g-3">
        <p className="col-md-10">Track your expenses for {appliedFilters.monthName || currentMonth} here!</p>

        <button className="col-md-2 btn btn-success " onClick={() => handleOnClick()}>{toggleView ? <span>Add expense</span> : <span>View expense</span>}</button>
      </div>
      {infoMessage && (
        <div className="alert alert-info mt-3" role="alert">
          {infoMessage}
        </div>
      )}
      {toggleView === true ? (
        <>
          <ExpenseFeed
            expenses={expenses}
            hasMore={hasMore}
            loadMore={() => {
              if (cursor) {
                fetchExpenses(appliedFilters, cursor);
              }
            }}
            onExpenseUpdate={(id, updatedExpense) =>
              setExpenses((prev) =>
                prev.map((e) => (e.id === id ? { ...e, ...updatedExpense } : e))
              )
            }
            onExpenseDelete={(id) =>
              setExpenses((prev) => prev.filter((e) => e.id !== id))
            }
          />
        </>
      ) : (
        <AddExpense
          onExpenseCreate={(newExpense) => {
            setExpenses((prev) => [newExpense, ...prev]);
            setInfoMessage("Added 1 expense. Click 'View expense' to see it.");
          }}
        />
      )}
    </div>
  );
};

export default ExpensesPage;