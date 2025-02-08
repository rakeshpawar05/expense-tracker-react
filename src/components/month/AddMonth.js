import React from "react";
import { createMonthApi } from "../../api/AxiosService";
import { Formik, Form, Field } from "formik";
import { useAuth } from "../../Auth/AuthContext";

const AddMonth = () => {

    const { userDetails} = useAuth();

    const monthList = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const yearList = ["2025", "2026", "2027", "2028"];

    // Function to add a new month
    const handleAddMonth = async (values, { resetForm }) => {
        try {
            // const response = await axios.post(`${API_BASE_URL}/months`, values);
            // setMonths([...months, response.data]); // Assuming response contains the added month
            console.log("adding month " + JSON.stringify(values));
            const monthReq = {
                name: values.month + "," + values.year,
                earning: values.earning,
                userId: userDetails.userId
            }

            await createMonthApi(monthReq).then((response) => {
                console.log("month created with id " + response.data)
                // setMonthNames(response.data);
                // setCurrentMonth(monthReq.name)
            })
            resetForm();
        } catch (error) {
            console.error("Failed to add month:", error);
            alert("Failed to add month. Please try again.");
        }
    };

    return (
        <div className="container mt-4">

            {/* Add New Month Section */}
            <div className="mb-4">
                <h4>Add New Month</h4>
                <Formik
                    initialValues={{ month: "", year: "", earning: 0 }}
                    onSubmit={handleAddMonth}
                >
                    <Form className="row g-3">
                        {/* <Field name="month" className="form-control me-2" placeholder="Enter Month (e.g., January 2025)" /> */}
                        {/* <Field name="month" className="form-control me-2" placeholder="Enter Month (e.g., January 2025)" /> */}

                        {/* <label htmlFor="month" className=" form-label flex-fill">
                            Select Month
                        </label> */}
                        <div className="col-md-3">
                            <Field
                                as="select"
                                // id="month"
                                name="month"
                                className=" form-control"
                            >
                                <option value="">-- Select a month --</option>
                                {monthList.map((month, index) => (
                                    <option key={index} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </Field>
                        </div>
                        {/* <label htmlFor="year" className="form- label flex-fill">
                            Select Year
                        </label> */}
                        <div className="col-md-3">
                            <Field
                                as="select"
                                // id="year"
                                name="year"
                                className="form-control"
                            >
                                <option value="">-- Select a year --</option>
                                {yearList.map((year, index) => (
                                    <option key={index} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </Field>
                        </div>
                        <div className="col-md-3">
                            {/* <label htmlFor="earning" className="form-label flex-fill">
                            Add Earnings
                        </label> */}
                            <Field name="earning" className="form-control" placeholder="Enter amount" />
                        </div>
                        <div className="col-md-3">
                            <button type="submit" className="btn btn-primary w-100">Add Month</button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
};

export default AddMonth;