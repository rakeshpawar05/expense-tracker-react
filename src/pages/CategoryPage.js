import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { getCategories, createCategory, deleteCategory } from "../api/categoryApi";
import { useAuth } from "../Auth/AuthContext";
import ExpenseFeed from "../components/expense/ExpenseFeed";
import SavingList from "../components/saving/SavingList";
import { FaPlus, FaTrash, FaEye } from "react-icons/fa";
import "./../styles/categorypage.css";

const CategoryPage = () => {
  const { userDetails, currentMonth, listOfAvailableMonths } = useAuth();
  const [categories, setCategories] = useState([]);
  const [viewExpense, setViewExpense] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [viewSaving, setViewSaving] = useState(false);
  const [savings, setSavings] = useState([]);
  const [displayId, setDisplayId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [currentMonth]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories(userDetails.userId, currentMonth);
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleAddCategory = async (values, { resetForm }) => {
    try {
      await createCategory({
        name: values.categoryName,
        userId: userDetails.userId,
        monthName: values.month || currentMonth
      });
      fetchCategories();
      resetForm();
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      setCategories(categories.filter((category) => category.id !== categoryId));
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const toggleExpenseView = (category) => {
    if (viewExpense && displayId === category.id) {
      setDisplayId(null);
      setViewExpense(false);
    } else {
      setViewExpense(true);
      setDisplayId(category.id);
      setExpenses(category.expenses || []);
    }
  };

  const toggleSavingView = (category) => {
    if (viewSaving && displayId === category.id) {
      setDisplayId(null);
      setViewSaving(false);
    } else {
      setViewSaving(true);
      setDisplayId(category.id);
      setSavings(category.savings || []);
    }
  };

  return (
    <div className="category-page">
      {/* Add Category Form */}
      <div className="add-form-card">
        <h3 className="form-title">Add New Category</h3>
        <Formik
          initialValues={{ categoryName: "", month: currentMonth || "" }}
          onSubmit={handleAddCategory}
        >
          {() => (
            <Form className="category-form">
              <div className="form-fields">
                <div className="form-group">
                  <label>Category Name</label>
                  <Field
                    name="categoryName"
                    className="form-input"
                    placeholder="Enter category name"
                  />
                </div>
                <div className="form-group">
                  <label>Month</label>
                  <Field as="select" name="month" className="form-select">
                    <option value="">-- Select a month --</option>
                    {listOfAvailableMonths.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
              <button type="submit" className="btn-submit">
                <FaPlus /> Add Category
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Categories Table */}
      <div className="categories-table-card">
        {categories.length > 0 ? (
          <div className="categories-list">
            {categories.map((category) => (
              <div key={category.id} className="category-item">
                <div className="category-info">
                  <h4 className="category-name">{category.name}</h4>
                  <div className="category-stats">
                    <div className="stat">
                      <span className="stat-label">Expenses</span>
                      <span className="stat-amount">
                        ₹
                        {category.expenses
                          ? category.expenses
                              .reduce((acc, expense) => acc + Number(expense.amount), 0)
                              .toLocaleString("en-IN")
                          : 0}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Savings</span>
                      <span className="stat-amount">
                        ₹
                        {category.savings
                          ? category.savings
                              .reduce((acc, saving) => acc + Number(saving.amount), 0)
                              .toLocaleString("en-IN")
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="category-actions">
                  <button
                    className="btn-action btn-view"
                    onClick={() => toggleExpenseView(category)}
                    title="View Expenses"
                  >
                    <FaEye />
                    {viewExpense && displayId === category.id ? "Hide" : "Expenses"}
                  </button>
                  <button
                    className="btn-action btn-view"
                    onClick={() => toggleSavingView(category)}
                    title="View Savings"
                  >
                    <FaEye />
                    {viewSaving && displayId === category.id ? "Hide" : "Savings"}
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => handleDeleteCategory(category.id)}
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
            <p>No categories found. Create one to get started!</p>
          </div>
        )}
      </div>

      {/* Expenses List */}
      {viewExpense && displayId && (
        <div className="detail-section">
          <h3>Expenses for {categories.find(c => c.id === displayId)?.name}</h3>
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
          <h3>Savings for {categories.find(c => c.id === displayId)?.name}</h3>
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

export default CategoryPage;