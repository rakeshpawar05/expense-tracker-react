import React, { useState, useEffect } from "react";
import AddSaving from "../components/saving/AddSaving";
import SavingList from "../components/saving/SavingList";
import { useAuth } from "../Auth/AuthContext";
import { getSavings } from "../api/savingApi";
import { FaPlus } from "react-icons/fa";
import "./../styles/savingpage.css";

const SavingsPage = () => {
  const { currentMonth, userDetails } = useAuth();

  const [toggleView, setToggleView] = useState(true);
  const [savings, setSavings] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const handleOnClick = () => {
    setToggleView(!toggleView);
  };

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
        setSavings((prev) => (pageNum === 0 ? response.data : [...prev, ...response.data]));
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
    <div className="savings-page">
      {/* Header */}
      <div className="page-header">
        {toggleView && (
          <button
            className="btn-action-primary"
            onClick={() => handleOnClick()}
          >
            <FaPlus /> Add Saving
          </button>
        )}
      </div>

      {/* Content */}
      {toggleView === true ? (
        <>
          <SavingList savingList={savings} />
          {hasMore && (
            <div className="load-more-section">
              <button
                className="btn-load-more"
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
        <div className="add-form-container">
          <AddSaving onSuccess={() => setToggleView(true)} />
          <button
            className="btn-secondary"
            onClick={() => setToggleView(true)}
          >
            Back to Savings
          </button>
        </div>
      )}
    </div>
  );
};

export default SavingsPage;
