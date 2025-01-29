import React, { useEffect, useState } from "react";
import { getMonthsApi, updateMonthApi, deleteMonthApi } from "../../api/AxiosService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import { Field, Formik } from "formik";

const MonthList = () => {

    const { userDetails, setCurrentMonth } = useAuth();
    const navigate = useNavigate();


    const [months, setMonths] = useState([]);
    const [editMonthId, setEditMonthId] = useState(null);
    const [summary, setSummary] = useState({ earnings: 0, expenses: 0, balance: 0 });

    useEffect(() => {
        fetchMonths();
    }, []);

    const fetchMonths = async () => {
        try {
            console.log("fetching months for userId " + userDetails.userId)
            const response = await getMonthsApi(userDetails.userId);
            setMonths(response.data);
            setCurrentMonth(response.data.name)
            // updateSummary(response.data.expenses, response.data.earning);
        } catch (error) {
            console.error("Error fetching months:", error);
        }
    };

    // Function to update the summary
    const updateSummary = (updatedExpenses, earning) => {
        console.log("ear " + updatedExpenses)
        const totalExpenses = updatedExpenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
        const totalEarnings = earning; // Replace with actual earnings logic or fetch from API
        setSummary({
            earnings: totalEarnings,
            expenses: totalExpenses,
            balance: totalEarnings - totalExpenses,
        });
    };

    const onUpdate = (id, values) => {
        console.log("id for update " + id);
        console.log("on update " + JSON.stringify(values));
        // console.log("on update " + expenses[0].amount);
        // expenses[0].amount = values.amount;
        // expenses[0].description = values.description;

        months.forEach((month) => {
            if (month.id === id) {
                month.earning = values.earning;
                // month.description = values.description;

                console.log("updated expense " + JSON.stringify(month))
                updateMonth(month)
            }
        })

    }

    const updateMonth = async (month) => {
        try {

            await updateMonthApi(month.id, month).then((response) => {
                console.log("after update response " + response.data)
                //   setExpenses(response.data);
            })
        } catch (error) {
            console.error("Failed to month ", error);
        }
    }

        const onDelete = async (id) => {
            console.log("on delete " + id);
            try {
    
                await deleteMonthApi(id).then((response) => {
                  console.log("after delete response " + response.data)
                //   setExpenses(response.data);
                // fetchExpenses()
                setMonths(prevMonths => prevMonths.filter(mon => mon.id !== id));
                })
              } catch (error) {
                console.error("Failed to delete ", error);
              }
        }

    const goToExpenses = (monthName) => {
        setCurrentMonth(monthName.name)
        navigate(`/expenses`);
    };

    return (
        <div className="container mt-4">
            <h4>Available Months</h4>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Earning</th>
                        <th>Expense</th>
                        <th>Balance</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        // months.length > 0 ? (
                        months.map((month) => (
                            <Formik
                                key={month.id}
                                initialValues={{earning: month.earning,
                                    expenses: (month.expenses.reduce((acc, expense) => acc + Number(expense.amount), 0)).toLocaleString('en-IN'),
                                    balance: (month.earning - month.expenses.reduce((acc, expense) => acc + Number(expense.amount), 0)).toLocaleString('en-IN')
                                }}
                                onSubmit={(values) => {
                                    onUpdate(month.id, values);
                                    setEditMonthId(null);
                                }}
                            >
                                {({ handleSubmit }) => (

                                    <tr>
                                        {/* {expense = month.expenses.reduce((acc, expense) => acc + Number(expense.amount), 0)} */}
                                        <td>{month.name}</td>
                                        <td>₹{
                                            editMonthId === month.id ?
                                                (<Field type="number" name="earning" className="form-control" />)
                                                :
                                                (month.earning).toLocaleString('en-IN')
                                        }</td>
                                        <td>₹{(month.expenses.reduce((acc, expense) => acc + Number(expense.amount), 0)).toLocaleString('en-IN')}</td>
                                        <td>₹{(month.earning - month.expenses.reduce((acc, expense) => acc + Number(expense.amount), 0)).toLocaleString('en-IN')}</td>
                                        <td>
                                            <button className="btn btn-primary" onClick={() => goToExpenses(month)}>
                                                View Expenses
                                            </button>
                                            {editMonthId === month.id ? (
                                                <>
                                                    <button type="button"
                                                        className="btn btn-secondary btn-sm me-2"
                                                        onClick={handleSubmit}>
                                                        save
                                                    </button>
                                                    <button type="button"
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => setEditMonthId(null)}>
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="btn btn-warning btn-sm me-2"
                                                        onClick={() => setEditMonthId(month.id)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button className="btn btn-danger btn-sm" onClick={() => onDelete(month.id)}>
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </Formik>
                        ))
                        // ) : (
                        //     <tr>
                        //         <td colSpan="2" className="text-center">
                        //             No months available.
                        //         </td>
                        //     </tr>
                        // )
                    }
                </tbody>
            </table>
        </div >
    );
};

export default MonthList;
