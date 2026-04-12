import React, { useState } from "react";
import AddMonth from "../components/month/AddMonth";
import MonthList from "../components/month/MonthList";
import { FaPlus } from "react-icons/fa";
import "./../styles/monthpage.css";

const MonthsPage = () => {
  const [toggleView, setToggleView] = useState(true);

  return (
    <div className="months-page">
      {/* Header */}
      <div className="page-header">
        {toggleView && (
          <button
            className="btn-action-primary"
            onClick={() => setToggleView(!toggleView)}
          >
            <FaPlus /> Add Month
          </button>
        )}
      </div>

      {/* Content */}
      {toggleView ? (
        <MonthList />
      ) : (
        <div className="add-form-container">
          <AddMonth onSuccess={() => setToggleView(true)} />
          <button
            className="btn-secondary"
            onClick={() => setToggleView(true)}
          >
            Back to Months
          </button>
        </div>
      )}
    </div>
  );
};

export default MonthsPage;