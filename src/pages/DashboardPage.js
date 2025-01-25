import React from "react";

const DashboardPage = () => {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Dashboard</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h4>Total Earnings</h4>
            <p>$5,000</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h4>Total Expenses</h4>
            <p>$2,500</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;