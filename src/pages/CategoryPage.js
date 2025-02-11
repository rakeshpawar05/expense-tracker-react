import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { getCategoriesApi, createCategoryApi, deleteCategoryApi } from "../api/AxiosService";
import { useAuth } from "../Auth/AuthContext";
import ExpenseList from "../components/expense/ExpenseList";

const CategoryPage = () => {
    const { userDetails, currentMonth, listOfAvailableMonths } = useAuth();
    const [categories, setCategories] = useState([]);
    const [viewExpense, setViewExpense] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [displayId, setDisplayId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            console.log("fetching category for month " + currentMonth)
            const response = await getCategoriesApi(userDetails.userId, currentMonth);
            setCategories(response.data);
            console.log("fetched categories ..... " + JSON.stringify(response.data))
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const handleAddCategory = async (values, { resetForm }) => {
        try {
            const response = await createCategoryApi({
                name: values.categoryName,
                userId: userDetails.userId,
                monthName: values.month
            });
            // setCategories([...categories, response.data]);
            fetchCategories();
            resetForm();
        } catch (error) {
            console.error("Failed to add category:", error);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await deleteCategoryApi(categoryId);
            setCategories(categories.filter((category) => category.id !== categoryId));
        } catch (error) {
            console.error("Failed to delete category:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Manage Categories for Month {currentMonth}</h2>

            {/* Add Category Form */}
            <Formik
                initialValues={{ categoryName: "" }}
                onSubmit={handleAddCategory}
            >
                {() => (
                    <Form className="row g-4">
                        <div className="form-group col-md-5">
                            {/* <label htmlFor="categoryName" className="form-label">Category Name</label> */}
                            <Field name="categoryName" id="categoryName" className="form-control" placeholder="Enter category name" />
                        </div>
                        <div className="form-group col-md-5">
                            {/* <label htmlFor="month" className="form-label">Select Month</label> */}
                            <Field as="select" id="month" name="month" className="form-control">
                                <option value="">-- Select a month --</option>
                                {listOfAvailableMonths.map((month, index) => (
                                    <option key={index} value={month}>{month}</option>
                                ))}
                            </Field>
                        </div>
                        <div className="form-group col-md-2">
                            <button type="submit" className="btn btn-primary w-100">Add Category</button>
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
                        <th>Category Name</th>
                        <th>Total Expense</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categories.length > 0 ? (
                            categories.map((category) => (
                                <tr key={category.id}>
                                    <td>{category.name}</td>
                                    <td>₹{category.expenses ?
                                        category.expenses.reduce((acc, expense) => acc + Number(expense.amount), 0).toLocaleString("en-IN")
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
                                                if (viewExpense && displayId === category.id) {
                                                    setDisplayId(null)
                                                    setViewExpense(false)
                                                    // setExpenses([])
                                                } else {
                                                    console.log(category.expenses)
                                                    setViewExpense(true)
                                                    setDisplayId(category.id)
                                                    setExpenses(
                                                        category.expenses ? category.expenses : []
                                                    );
                                                }
                                            }}
                                        >
                                            {(viewExpense && displayId === category.id) ? "Hide Expenses" : "View Expenses"}
                                        </button>

                                        {/* </td> */}
                                        {/* <td> */}
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleDeleteCategory(category.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )
                            )) :
                            <tr>
                                <td colSpan="3" className="text-center text-muted fw-bold">
                                    No expenses found.
                                </td>
                            </tr>
                    }
                </tbody>
            </table>

            {/* Render Expenses List for Selected Category */}
            {viewExpense && (
                expenses.length > 0 ? (<ExpenseList expenseList={expenses} fetch={false}/>)
                    : <p className="alert alert-secondary text-center">No Expense to display</p>
            )}
        </div>
    );
};

export default CategoryPage;