import React from "react";
import AddExpense from "../components/expense/AddExpense";

const ExpensesPage = () => {
  return (
    <div className="container mt-4">
      <h1>Expenses</h1>
      <p>Track your expenses here!</p>

      <AddExpense/>
    </div>
  );
};

export default ExpensesPage;