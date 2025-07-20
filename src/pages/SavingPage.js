import React, { useState, useEffect } from "react";
import AddSaving from "../components/saving/AddSaving";
import SavingList from "../components/saving/SavingList";
import { useAuth } from "../Auth/AuthContext";
import { getSavingApi } from "../api/AxiosService";

const SavingsPage = () => {

  const { currentMonth, userDetails } = useAuth();

  const [toggleView, setToggleView] = useState(true);
  const [savings, setSavings] = useState([]);

  // useEffect(() => {
  //   setToggleView(true)
  //   console.log("toggle")
  // }, [])

  const handleOnClick = () => {
    setToggleView(!toggleView)
  }

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        console.log("fetching savings for month " + currentMonth);
        const params = {
          "monthName": currentMonth,
          "userId": userDetails.userId
        };
        const response = await getSavingApi(params);
        console.log("savings " + JSON.stringify(response.data));
        setSavings(response.data);
        setToggleView(true)
      } catch (error) {
        console.error("Failed to fetch savings", error);
      }
    };

    fetchSavings();
  }, [currentMonth]);

  return (
    <div className="container mt-4">
      <h1>Savings</h1>
      <div className="row g-3">
        <p className="col-md-10">Track your Savings for {currentMonth}  here!</p>

        <button className="col-md-2 btn btn-success " onClick={() => handleOnClick()}>{toggleView ? <span>Add Saving</span> : <span>View Saving</span>}</button>
      </div>
      {toggleView === true ? <SavingList savingList={savings} fetch={true} /> : <AddSaving />}
      {/* <AddExpense />
      <br />
      <ExpenseList /> */}
    </div>
  );
};

export default SavingsPage;