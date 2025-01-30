import React, { useState, useEffect } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { getTop5Expenses } from "../../api/AxiosService";
import { FaList } from "react-icons/fa";

const TopFiveExpenses = () => {

    const { currentMonth } = useAuth();

    // Mock data for the top 5 expenses (replace with real data from your API)
    const [topExpenses, setTopExpenses] = useState([]);

    useEffect(() => {
        // Simulate fetching data from an API
        const fetchExpenses = async () => {
            // Example expenses (replace this logic with your API call)
            if (currentMonth != '') {
                console.log("current month " + currentMonth)
                // const expenses = [
                //     { name: "Rent", amount: 1500 },
                //     { name: "Groceries", amount: 300 },
                //     { name: "Utilities", amount: 200 },
                //     { name: "Internet", amount: 100 },
                //     { name: "Dining Out", amount: 75 },
                // ];

                try {
                    await getTop5Expenses(currentMonth).then((response) => {
                        // setAmount(response.data);
                        console.log("expense " + JSON.stringify(response.data))
                        // console.log("earnings " + response.data.expenses.reduce((acc, expense) => acc + Number(expense.amount), 0))
                        // response.data.expenses.map( expense => expense.amount).sum();
                        // setCurrentMonth(response.data.name)
                        // updateSummary(response.data.expenses, response.data.earning);
                        setTopExpenses(response.data); // Set the fetched expenses
                        console.log("done")
                    })
                } catch (error) {
                    console.error("Failed to top 5 expenses:", error);
                }



            }
        };

        fetchExpenses();
    }, [currentMonth]);

    return (
        <div className="container mt-mb-5 pb-3">

            {/* Top 5 Expenses Section */}
            {/* <div className="card">
                <div className="card-body">
                    <h3>Top 5 Expenses of the Month</h3>

                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>Date</th>
                                <th style={{ width: "80%" }}>Description</th>
                                <th style={{ width: "10%", textAlign: "right" }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topExpenses.map((expense, index) => (
                                <tr key={index}>
                                    <td>{expense.date}</td>
                                    <td className="text-truncate">{expense.description}</td>
                                    <td style={{ textAlign: "right" }}>₹{(expense.amount).toLocaleString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table> */}

            {/* <ul className="list-group">
                        {topExpenses.length > 0 ? (
                            topExpenses.map((expense, index) => (
                                // <li key={index} className="list-group-item d-flex justify-content-between">
                                //     <span className="p-2">{expense.date}</span>
                                //     <span className="p-2 flex-grow-1">{expense.description}</span>
                                //     <span className="p-2">${expense.amount}</span>
                                // </li>

                                // <li key={index} className="list-group-item d-flex align-items-center">
                                //     <span className="p-2 flex-grow-0" style={{ flex: 1 }}>{expense.date}</span>
                                //     <span className="p-2 text-truncate" style={{ flex: 3 }}>{expense.description}</span>
                                //     <span className="p-2 flex-grow-0" style={{ flex: 1, textAlign: "right" }}>${expense.amount}</span>
                                // </li>
                            ))
                        ) : (
                            <li className="list-group-item text-center">No expenses found.</li>
                        )}
                    </ul> */}
            {/* </div>
            </div> */}

            {/* <div className="card shadow-lg p-4 rounded-3">
                <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                        <FaList size={30} className="me-3 text-primary" />
                        <h4 className="mb-0 text-primary">Top 5 Expenses of the Month</h4>
                    </div>

                    <table className="table table-striped table-hover">
                        <thead className="bg-primary text-white">
                            <tr>
                                <th style={{ width: "15%" }}>Date</th>
                                <th style={{ width: "70%" }}>Description</th>
                                <th style={{ width: "15%", textAlign: "right" }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topExpenses.length > 0 ? (
                                topExpenses.map((expense, index) => (
                                    <tr key={index}>
                                        <td className="fw-bold">{expense.date}</td>
                                        <td className="text-truncate">{expense.description}</td>
                                        <td className="text-end fw-bold text-danger">
                                            ₹{expense.amount.toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted">
                                        No expenses found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div> */}


            <div className="card shadow-lg p-4 rounded-3" style={{ background: "#f8f9fa", border: "2px solid #007bff" }}>
                <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                        <FaList size={30} className="me-3 text-primary" />
                        <h4 className="mb-0 text-primary fw-bold">Top 5 Expenses of the Month</h4>
                    </div>

                    <table className="table table-hover">
                        <thead style={{ background: "linear-gradient(90deg, #007bff, #0056b3)", color: "white" }}>
                            <tr>
                                <th style={{ width: "15%", fontSize: "1.1rem", fontWeight: "bold" }}>Date</th>
                                <th style={{ width: "65%", fontSize: "1.1rem", fontWeight: "bold" }}>Description</th>
                                <th style={{ width: "20%", textAlign: "right", fontSize: "1.1rem", fontWeight: "bold" }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topExpenses.length > 0 ? (
                                topExpenses.map((expense, index) => (
                                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f1f1f1" }}>
                                        <td className="fw-bold text-dark">{expense.date}</td>
                                        <td className="text-truncate text-secondary">{expense.description}</td>
                                        <td className="text-end fw-bold" style={{ color: "#dc3545", fontSize: "1.1rem" }}>
                                            ₹{expense.amount.toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted fw-bold">
                                        No expenses found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>


    );
};

export default TopFiveExpenses;