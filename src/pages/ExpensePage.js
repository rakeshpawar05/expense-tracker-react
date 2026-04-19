import React, { useState, useEffect, useCallback } from "react";
import AddExpense from "../components/expense/AddExpense";
import ExpenseFeed from "../components/expense/ExpenseFeed";
import { useAuth } from "../Auth/AuthContext";
import { getExpenses } from "../api/expenseApi";
import { getMonthNamesApi } from "../api/monthApi";
import { getCategories } from "../api/categoryApi";
import { FaPlus, FaChevronDown } from "react-icons/fa";
import "./../styles/expensepage.css";

const ExpensesPage = () => {
  const { currentMonth, setCurrentMonth, userDetails } = useAuth();

  const [toggleView, setToggleView] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [infoMessage, setInfoMessage] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [description, setDescription] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [cursor, setCursor] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState({
    yearMonth: currentMonth,
    description: "",
    fromDate: "",
    toDate: "",
  });

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const fetchExpenses = useCallback(
    async (filters = appliedFilters, cursorValue = null) => {
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
          params.yearMonth = filters.yearMonth || currentMonth || undefined;
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
    },
    [appliedFilters, currentMonth, userDetails.userId]
  );

  useEffect(() => {
    const initialMonth = currentMonth || "";
    setSelectedMonth(initialMonth);
    setAppliedFilters((prev) => ({
      ...prev,
      yearMonth: initialMonth,
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

  const fetchCategories = useCallback(
    async (yearMonth) => {
      if (!userDetails?.userId || !yearMonth) {
        setCategories([]);
        return;
      }

      try {
        const response = await getCategories(userDetails.userId, yearMonth);
        const categoryNames = Array.isArray(response.data)
          ? [...new Set(response.data.map((category) => category.name).filter(Boolean))]
          : [];
        setCategories(categoryNames);
      } catch (error) {
        console.error("Failed to load categories", error);
        setCategories([]);
      }
    },
    [userDetails?.userId]
  );

  useEffect(() => {
    const monthForCategories = selectedMonth || currentMonth;
    if (appliedFilters.fromDate || appliedFilters.toDate) return;
    fetchCategories(monthForCategories);
  }, [fetchCategories, selectedMonth, currentMonth, appliedFilters.fromDate, appliedFilters.toDate]);

  const availableCategories = React.useMemo(() => {
    if (appliedFilters.fromDate || appliedFilters.toDate) {
      return Array.from(
        new Set(expenses.map((expense) => expense.categoryName).filter(Boolean))
      );
    }
    return categories;
  }, [appliedFilters.fromDate, appliedFilters.toDate, expenses, categories]);

  useEffect(() => {
    if (selectedCategory !== "All" && !availableCategories.includes(selectedCategory)) {
      setSelectedCategory("All");
      setAppliedFilters((prev) => ({ ...prev, categoryName: "" }));
    }
  }, [availableCategories, selectedCategory]);

  useEffect(() => {
    if (!userDetails?.userId) return;
    setExpenses([]);
    setCursor(null);
    setHasMore(true);
    fetchExpenses(appliedFilters, null);
    setToggleView(true);
  }, [appliedFilters, userDetails?.userId, fetchExpenses]);

  const handleApplyFilters = () => {
    const usingDateRange = Boolean(fromDate || toDate);
    const yearMonth = usingDateRange ? "" : selectedMonth || currentMonth;
    const nextFilters = {
      yearMonth,
      description,
      fromDate,
      toDate,
      categoryName: selectedCategory === "All" ? "" : selectedCategory,
    };
    setAppliedFilters(nextFilters);
    if (!usingDateRange && yearMonth && yearMonth !== currentMonth) {
      setCurrentMonth(yearMonth);
    }
  };

  const handleResetFilters = () => {
    const yearMonth = currentMonth || "";
    setSelectedMonth(yearMonth);
    setSelectedCategory("All");
    setDescription("");
    setFromDate("");
    setToDate("");
    setAppliedFilters({ yearMonth, description: "", fromDate: "", toDate: "", categoryName: "" });
  };

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setAppliedFilters((prev) => ({
      ...prev,
      categoryName: categoryName === "All" ? "" : categoryName,
    }));
  };

  return (
    <div className="expenses-page">
      <div className="expenses-header">
        {toggleView && (
          <button
            className="btn-add-expense"
            onClick={handleOpenAddModal}
          >
            <FaPlus />
            Add Expense
          </button>
        )}
      </div>

      {toggleView === true ? (
        <>
          {/* Filter Toggle */}
          <div className="filter-section">
            <button
              className="filter-toggle-btn"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <span>Filters</span>
              <FaChevronDown className={showFilters ? "rotate" : ""} />
            </button>

            {showFilters && (
              <div className="filter-panel">
                <div className="filter-grid">
                  <div className="filter-group">
                    <label>Month</label>
                    <select
                      className="filter-select"
                      value={selectedMonth || ""}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      <option value="">Select month</option>
                      {(availableMonths.length ? availableMonths : [currentMonth]).map((month, index) => (
                        month && <option key={index} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Description</label>
                    <input
                      type="text"
                      className="filter-input"
                      placeholder="Search by description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="filter-group">
                    <label>From</label>
                    <input
                      type="date"
                      className="filter-input"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>

                  <div className="filter-group">
                    <label>To</label>
                    <input
                      type="date"
                      className="filter-input"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="filter-actions">
                  <button
                    className="btn-apply"
                    onClick={handleApplyFilters}
                  >
                    Apply Filters
                  </button>
                  <button
                    className="btn-reset"
                    onClick={handleResetFilters}
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="category-filter-section">
            <label className="category-filter-label">Category</label>
            <div className="category-filter-buttons">
              <button
                type="button"
                className={`category-btn ${selectedCategory === "All" ? "active" : ""}`}
                onClick={() => handleCategorySelect("All")}
              >
                All
              </button>
              {availableCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`category-btn ${selectedCategory === category ? "active" : ""}`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Info Message */}
          {infoMessage && (
            <div className="info-message">
              {infoMessage}
            </div>
          )}

          {/* Expenses List */}
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
      ) : null}

      <AddExpense
        show={showAddModal}
        onHide={handleCloseAddModal}
        onExpenseCreate={(newExpense) => {
          setExpenses((prev) => [newExpense, ...prev]);
          setInfoMessage("Added 1 expense successfully!");
          setTimeout(() => setInfoMessage(""), 3000);
        }}
      />
    </div>
  );
};

export default ExpensesPage;