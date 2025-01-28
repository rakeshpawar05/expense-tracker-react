import React from "react";
import AddMonth from "../components/month/AddMonth";

const MonthsPage = () => {
    return (
        <div className="container mt-4">
            <h1>Months</h1>
            <p>Track your months here!</p>

            <AddMonth />
        </div>
    );
};

export default MonthsPage;