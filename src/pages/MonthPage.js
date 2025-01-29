import React from "react";
import AddMonth from "../components/month/AddMonth";
import MonthList from "../components/month/MonthList";

const MonthsPage = () => {
    return (
        <div className="container mt-4">
            <h1>Months</h1>
            <p>Track your months here!</p>

            <AddMonth />
            <br />
            <MonthList />
        </div>
    );
};

export default MonthsPage;