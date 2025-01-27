import React, { useState, useEffect } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { getTop5Expenses } from "../../api/AxiosService";

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
            <div className="card">
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
                    </table>

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
                </div>
            </div>
        </div>
    );
};

export default TopFiveExpenses;