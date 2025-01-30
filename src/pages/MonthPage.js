import React, { useState } from "react";
import AddMonth from "../components/month/AddMonth";
import MonthList from "../components/month/MonthList";
import { useAuth } from "../Auth/AuthContext";

const MonthsPage = () => {

    const [toggleView, setToggleView] = useState(true);

    return (
        <div className="container mt-4">
            <h1>Months</h1>
            <div className="row g-3">
                <p className="col-md-10">Track your months here!</p>
                <button type="submit" className=" col-md-2 btn btn-success" onClick={()=> setToggleView(!toggleView)}>
                    {toggleView ? <span>Add Month</span> : <span>View Months</span>}</button>
            </div>

        {toggleView ? <MonthList /> : <AddMonth />}

            {/* <AddMonth />
            <br />
            <MonthList /> */}
        </div>
    );
};

export default MonthsPage;