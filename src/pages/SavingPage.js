import React, { useState, useEffect } from "react";
import AddSaving from "../components/saving/AddSaving";
import SavingList from "../components/saving/SavingList";
import { useAuth } from "../Auth/AuthContext";
import { getSavings } from "../api/savingApi";

const SavingsPage = () => {

  const { currentMonth, userDetails } = useAuth();

  const [toggleView, setToggleView] = useState(true);
  const [savings, setSavings] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // useEffect(() => {
  //   setToggleView(true)
  //   console.log("toggle")
  // }, [])

  const handleOnClick = () => {
    setToggleView(!toggleView)
  }

  const fetchSavings = async (pageNum = 0) => {
    try {
      const params = {
        monthName: currentMonth,
        userId: userDetails.userId,
        page: pageNum,
        limit: 20,
      };
      const response = await getSavings(params);
      if (response.data && response.data.length > 0) {
        setSavings((prev) => [...prev, ...response.data]);
        setHasMore(response.data.length === 20);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch savings", error);
    }
  };

  useEffect(() => {
    setSavings([]);
    setPage(0);
    setHasMore(true);
    if (currentMonth) {
      fetchSavings(0);
      setToggleView(true);
    }
  }, [currentMonth]);

  return (
    <div className="container mt-4">
      <h1>Savings</h1>
      <div className="row g-3">
        <p className="col-md-10">Track your Savings for {currentMonth}  here!</p>

        <button className="col-md-2 btn btn-success " onClick={() => handleOnClick()}>{toggleView ? <span>Add Saving</span> : <span>View Saving</span>}</button>
      </div>
      {toggleView === true ? (
        <>
          <SavingList savingList={savings} />
          {hasMore && (
            <div className="d-grid mt-3">
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  const next = page + 1;
                  setPage(next);
                  fetchSavings(next);
                }}
              >
                Load more
              </button>
            </div>
          )}
        </>
      ) : (
        <AddSaving />
      )}
      {/* <AddExpense />
      <br />
      <ExpenseList /> */}
    </div>
  );
};

export default SavingsPage;