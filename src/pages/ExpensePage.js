import React, { useState } from "react";
import AddExpense from "../components/expense/AddExpense";
import ExpenseList from "../components/expense/ExpenseList";
import { useAuth } from "../Auth/AuthContext";

const ExpensesPage = () => {

  const {currentMonth} = useAuth();

  const [toggleView, setToggleView] = useState(true);

  const handleOnClick = () => {
    setToggleView(!toggleView)
  }

  return (
    <div className="container mt-4">
      <h1>Expenses</h1>
      <p>Track your expenses for {currentMonth}  here!</p>

      <button className="button" onClick={() => handleOnClick()}>{toggleView ? <span>Add expense</span> : <span>View expense</span>}</button>

      {toggleView === true ? <ExpenseList/> : <AddExpense/> }
      {/* <AddExpense />
      <br />
      <ExpenseList /> */}
    </div>
  );
};

export default ExpensesPage;