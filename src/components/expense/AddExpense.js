import React from "react";
import { createExpenseApi } from "../../api/AxiosService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAuth } from "../../Auth/AuthContext";

const AddExpense = () => {

    const monthList = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];


    // Function to add an expense
    const handleAddExpense = async (values, { resetForm }) => {
        try {
            // const response = await axios.post(`${API_BASE_URL}/expenses`, values);
            // setExpenses([...expenses, response.data]); // Assuming response contains the added expense

            // Update summary
            // updateSummary([...expenses, response.data]);

            const expenseMonthName = monthList[parseInt(values.date.toString().split('-')[1]) - 1] + "," +
                values.date.toString().split('-')[0]

            const expense = {
                description: values.name,
                amount: values.amount,
                date: values.date.toString(),
                monthName: expenseMonthName
            }

            console.log("values " + JSON.stringify(expense))
            // console.log("values "+ values.date.toString())
            // console.log("values "+ values.date.toString().split('-')[1])
            // console.log("values "+ parseInt(values.date.toString().split('-')[1]))
            // console.log("values "+ monthList[parseInt(values.date.toString().split('-')[1]) - 1])

            await createExpenseApi(expense).then((response) => {
                console.log("expense created with id " + response.data)
                // setMonthNames(response.data);
                // setCurrentMonth(monthReq.name)
            })

            resetForm();
        } catch (error) {
            console.error("Failed to add expense:", error);
            alert("Failed to add expense. Please try again.");
        }
    };

    return (
        <div className="container mt-4">

            {/* Add Expense Section */}
            <div className="mb-4">
                <h4>Add Expense</h4>
                <Formik
                    initialValues={{}}
                    onSubmit={handleAddExpense}
                >
                    <Form className="row g-3">
                        <div className="col-md-4">
                            <Field name="name" className="form-control" placeholder="Expense Description" />
                        </div>
                        <div className="col-md-2">
                            <Field name="category" as="select" className="form-control">
                                <option value="">Select Category</option>
                                <option value="Food">Food</option>
                                <option value="Travel">Travel</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Other">Other</option>
                            </Field>
                        </div>
                        <div className="col-md-2">
                            <Field name="amount" type="number" className="form-control" placeholder="Amount" />
                        </div>
                        {/* <div className="col-md-2">
                            <Field name="month" className="form-control" placeholder="month" />
                        </div> */}
                        <div className="col-md-2">
                            <Field name="date" type="date" className="form-control" />
                        </div>
                        <div className="col-md-2">
                            <button type="submit" className="btn btn-success w-100">Add Expense</button>
                        </div>
                    </Form>
                </Formik>
            </div>

        </div>
    );
};

export default AddExpense;