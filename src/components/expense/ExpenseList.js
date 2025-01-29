import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useAuth } from "../../Auth/AuthContext";
import { getExpenseApi, updateExpenseApi, deleteExpenseApi } from "../../api/AxiosService";

const ExpenseList = () => {
    const {currentMonth} = useAuth();
    const [editingId, setEditingId] = useState(null);
    const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        console.log("fetching expenses for month " + currentMonth)
        const params = {
            "monthName": currentMonth
        }
        await getExpenseApi(params).then((response) => {
          console.log("expenses " + response.data)
          setExpenses(response.data);
        })
      } catch (error) {
        console.error("Failed to expenses ", error);
      }
    };

    fetchExpenses();
  }, [currentMonth]);

    // const expenses = [{ "id": 14, "description": "higesht", "amount": 25000, "date": "2025-01-12", "monthName": "january,2025", "categoryName": null }]

    const onUpdate = (id, values) => {
        console.log("id for update " + id);
        console.log("on update " + JSON.stringify(values));
        console.log("on update " + expenses[0].amount);
        expenses[0].amount = values.amount;
        expenses[0].description = values.description;

        expenses.forEach((expense) => {
            if(expense.id === id) {
                expense.amount = values.amount;
                expense.description = values.description;

                console.log("updated expense "+ JSON.stringify(expense))
                updateExpense(expense)
            }
        })

    }

    const updateExpense =async(expense) => {
        try {

            await updateExpenseApi(expense.id, expense).then((response) => {
              console.log("after update response " + response.data)
            //   setExpenses(response.data);
            })
          } catch (error) {
            console.error("Failed to update ", error);
          }
    }

    const onDelete = async (id) => {
        console.log("on delete " + id);
        try {

            await deleteExpenseApi(id).then((response) => {
              console.log("after delete response " + response.data)
            //   setExpenses(response.data);
            // fetchExpenses()
            setExpenses(prevExpenses => prevExpenses.filter(exp => exp.id !== id));
            })
          } catch (error) {
            console.error("Failed to delete ", error);
          }
    }


    return (
        <div className="container mt-3">
          <h3 className="text-center">Expenses</h3>
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <Formik
                  key={expense.id}
                  initialValues={{ description: expense.description, amount: expense.amount }}
                  onSubmit={(values) => {
                    onUpdate(expense.id, values);
                    setEditingId(null);
                  }}
                >
                  {({ handleSubmit }) => (
                    <tr>
                      <td>{expense.date}</td>
                      <td>
                        {editingId === expense.id ? (
                          <Field type="text" name="description" className="form-control" />
                        ) : (
                          expense.description
                        )}
                      </td>
                      <td>
                        {editingId === expense.id ? (
                          <Field type="number" name="amount" className="form-control" />
                        ) : (
                          `$${expense.amount}`
                        )}
                      </td>
                      <td>
                        {editingId === expense.id ? (
                          <>
                            <button type="button" className="btn btn-success btn-sm me-2" onClick={handleSubmit}>
                              Save
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() => setEditingId(expense.id)}
                            >
                              Edit
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => onDelete(expense.id)}>
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  )}
                </Formik>
              ))}
            </tbody>
          </table>
        </div>
      );

    // return (
    //     <table className="table">
    //         <thead>
    //             <tr>
    //                 <th style={{ width: "20%" }}>Date</th>
    //                 <th style={{ width: "40%" }}>Description</th>
    //                 <th style={{ width: "20%" }}>Amount</th>
    //                 <th style={{ width: "20%" }}>Actions</th>
    //             </tr>
    //         </thead>
    //         <tbody>
    //             {expenses.map((expense) => (
    //                 <tr key={expense.id}>
    //                     {editingId === expense.id ? (
    //                         <Formik
    //                             initialValues={{
    //                                 date: expense.date,
    //                                 description: expense.description,
    //                                 amount: expense.amount,
    //                             }}
    //                             onSubmit={(values) => {
    //                                 onUpdate(expense.id, values);
    //                                 setEditingId(null);
    //                             }}
    //                         >
    //                             {({ isSubmitting }) => (
    //                                 <Form>
    //                                     <td>
    //                                         <Field type="date" name="date" className="form-control" />
    //                                     </td>
    //                                     <td>
    //                                         <Field type="text" name="description" className="form-control" />
    //                                     </td>
    //                                     <td>
    //                                         <Field type="number" name="amount" className="form-control" />
    //                                     </td>
    //                                     <td>
    //                                         <button type="submit" className="btn btn-success btn-sm me-2" disabled={isSubmitting}>
    //                                             Save
    //                                         </button>
    //                                         <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>
    //                                             Cancel
    //                                         </button>
    //                                     </td>
    //                                 </Form>
    //                             )}
    //                         </Formik>
    //                     ) : (
    //                         <>
    //                             <td>{expense.date}</td>
    //                             <td>{expense.description}</td>
    //                             <td>${expense.amount}</td>
    //                             <td>
    //                                 <button className="btn btn-warning btn-sm me-2" onClick={() => setEditingId(expense.id)}>
    //                                     Edit
    //                                 </button>
    //                                 <button className="btn btn-danger btn-sm" onClick={() => onDelete(expense.id)}>
    //                                     Delete
    //                                 </button>
    //                             </td>
    //                         </>
    //                     )}
    //                 </tr>
    //             ))}
    //         </tbody>
    //     </table>
    // );
};

export default ExpenseList;
