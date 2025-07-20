import React, { useState, useEffect } from "react";
import { createSavingApi, getCategoriesApi, getEventsApi } from "../../api/AxiosService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";

const AddSaving = () => {

    // const {currentMonth} = useAuth();
    const { currentMonth, setCurrentMonth, userDetails } = useAuth();
    const navigate = useNavigate();

    const monthList = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const [categories, setCategories] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchEvents();
    }, [currentMonth]);

    const fetchCategories = async () => {
        try {
            await getCategoriesApi(userDetails.userId, currentMonth).then((response) => {
                response.data.push({ "name": "Add New" })
                console.log("categories " + JSON.stringify(response.data))
                setCategories(response.data);
            })
        } catch (error) {
            console.error("Failed to categories ", error);
        }
    }
    const fetchEvents = async () => {
        try {
            await getEventsApi(userDetails.userId).then((response) => {
                // response.data.push({ "name": "Add New" })
                console.log("events " + JSON.stringify(response.data))
                setEvents(response.data);
            })
        } catch (error) {
            console.error("Failed to categories ", error);
        }
    }


    // Function to add an Saving
    const handleAddSaving = async (values, { resetForm }) => {
        try {
            // const response = await axios.post(`${API_BASE_URL}/expenses`, values);
            // setExpenses([...expenses, response.data]); // Assuming response contains the added expense

            // Update summary
            // updateSummary([...expenses, response.data]);

            const SavingMonthName = monthList[parseInt(values.date.toString().split('-')[1]) - 1] + "," +
                values.date.toString().split('-')[0]

            const saving = {
                description: values.name,
                amount: values.amount,
                date: values.date.toString(),
                monthName: SavingMonthName,
                categoryName: values.categoryName.trim(),
                eventName: values.eventName,
                userId: userDetails.userId
            }

            console.log("values " + JSON.stringify(saving))
            // console.log("values "+ values.date.toString())
            // console.log("values "+ values.date.toString().split('-')[1])
            // console.log("values "+ parseInt(values.date.toString().split('-')[1]))
            // console.log("values "+ monthList[parseInt(values.date.toString().split('-')[1]) - 1])

            await createSavingApi(saving).then((response) => {
                console.log("saving created with id " + response.data)
                // setMonthNames(response.data);
                // setCurrentMonth(monthReq.name)
            })

            resetForm();
            // const goToExpenses = (month) => {
            // setCurrentMonth(expenseMonthName);
            // navigate(`/expenses`);
            // };
            goToSavings(SavingMonthName);
        } catch (error) {
            console.error("Failed to add saving:", error);
            alert("Failed to add saving. Please try again.");
        }
    };

    const goToSavings = (savingMonthName) => {
        // setCurrentMonth(expenseMonthName);
        console.log("navigating...")
        navigate(`/savings`, { replace: true });
    };
    return (
        <div className="container mt-4">

            {/* Add Saving Section */}
            <div className="mb-4">
                <h4>Add Saving</h4>
                <Formik
                    initialValues={{
                        "name": "",
                        "categoryName": "",
                        "eventName": "",
                        "amount": "",
                        "date": ""
                    }}
                    onSubmit={handleAddSaving}
                >
                    {({ values }) => (

                        <Form className="row g-3">
                            <div className="col-md-4">
                                <Field name="name" className="form-control" placeholder="Saving Description" />
                            </div>
                            <div className="col-md-2">
                                {/* <Field
                                as="select"
                                // id="year"
                                name="categoryName"
                                className="form-control"
                            >
                                <option value="">-- Select a category --</option>
                                {categories.length > 0 ??(
                                categories.map((category, index) => (
                                    <option key={index} value={category.name}>
                                        {category.name}
                                    </option>
                                )))}
                            </Field> */}

                                {categories.length > 0 && values.categoryName === "" ? (
                                    <Field as="select" name="categoryName" className="form-control">
                                        <option value="">-- Select a category --</option>
                                        {categories.map((category, index) => (
                                            <option key={index} value={category.name}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Field>
                                ) : (
                                    values.categoryName === "Add New" ? (
                                        <Field
                                            type="text"
                                            name="categoryName"
                                            className="form-control"
                                            placeholder="Enter category"
                                            value={" "}
                                        />
                                    ) :
                                        (
                                            <Field
                                                type="text"
                                                name="categoryName"
                                                className="form-control"
                                                placeholder="Enter category"
                                            // value={values.categoryName}
                                            />
                                        )
                                )}

                            </div>

                            {events.length > 0 && (
                                <div className="col-md-2">

                                    <Field as="select" name="eventName" className="form-control">
                                        <option value="">-- Select a Event --</option>
                                        {events.map((event, index) => (
                                            <option key={index} value={event.name}>
                                                {event.name}
                                            </option>
                                        ))}
                                    </Field>

                                </div>
                            )}

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
                                <button type="submit" className="btn btn-success w-100">Add Saving</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

        </div>
    );
};

export default AddSaving;