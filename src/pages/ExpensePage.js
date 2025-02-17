import React, { useState, useEffect } from "react";
import AddExpense from "../components/expense/AddExpense";
import ExpenseList from "../components/expense/ExpenseList";
import { useAuth } from "../Auth/AuthContext";
import { getExpenseApi } from "../api/AxiosService";

const ExpensesPage = () => {

  const { currentMonth, userDetails } = useAuth();

  const [toggleView, setToggleView] = useState(true);
  const [expenses, setExpenses] = useState([]);

  // useEffect(() => {
  //   setToggleView(true)
  //   console.log("toggle")
  // }, [])

  const handleOnClick = () => {
    setToggleView(!toggleView)
  }

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        console.log("fetching expenses for month " + currentMonth);
        const params = {
          "monthName": currentMonth,
          "userId": userDetails.userId
        };
        const response = await getExpenseApi(params);
        console.log("expenses " + JSON.stringify(response.data));
        setExpenses(response.data);
        setToggleView(true)
      } catch (error) {
        console.error("Failed to fetch expenses", error);
      }
    };

    fetchExpenses();
  }, [currentMonth]);

  return (
    <div className="container mt-4">
      <h1>Expenses</h1>
      <div className="row g-3">
        <p className="col-md-10">Track your expenses for {currentMonth}  here!</p>

        <button className="col-md-2 btn btn-success " onClick={() => handleOnClick()}>{toggleView ? <span>Add expense</span> : <span>View expense</span>}</button>
      </div>
      {toggleView === true ? <ExpenseList expenseList={expenses} fetch={true} /> : <AddExpense />}
      {/* <AddExpense />
      <br />
      <ExpenseList /> */}
    </div>
  );
};

export default ExpensesPage;