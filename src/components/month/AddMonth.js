import React, { useState } from "react";
import { createMonthApi } from "../../api/monthApi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../Auth/AuthContext";
import { FaPlus, FaArrowLeft } from "react-icons/fa";
import "./../../styles/monthform.css";

const AddMonth = ({ onSuccess = () => {} }) => {
    const { userDetails } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const monthList = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const yearList = ["2025", "2026", "2027", "2028"];

    const validationSchema = Yup.object().shape({
        month: Yup.string().required("Please select a month"),
        year: Yup.string().required("Please select a year"),
        earning: Yup.number()
            .required("Earning amount is required")
            .positive("Earning must be a positive number")
            .typeError("Earning must be a valid number"),
    });

    const handleAddMonth = async (values, { resetForm }) => {
        try {
            setIsSubmitting(true);
            setSuccessMessage("");

            const monthReq = {
                name: values.month + "," + values.year,
                earning: parseFloat(values.earning),
                userId: userDetails.userId
            };

            const response = await createMonthApi(monthReq);
            console.log("Month created with id:", response.data);

            setSuccessMessage(`✅ Month "${monthReq.name}" created successfully!`);
            resetForm();

            setTimeout(() => {
                setSuccessMessage("");
                onSuccess();
            }, 2000);
        } catch (error) {
            console.error("Failed to add month:", error);
            alert("Failed to add month. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-month-form-container">
            {successMessage && <div className="form-success">{successMessage}</div>}

            <h2 className="form-title">Add New Month</h2>
            <p className="form-subtitle">Create a new month to track your finances</p>

            <Formik
                initialValues={{
                    month: "",
                    year: "",
                    earning: ""
                }}
                validationSchema={validationSchema}
                onSubmit={handleAddMonth}
            >
                {({ values, errors, touched, isValid }) => (
                    <Form>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="month" className="form-label required">
                                    Select Month
                                </label>
                                <div className="select-wrapper">
                                    <Field
                                        as="select"
                                        id="month"
                                        name="month"
                                        className="form-control-custom"
                                    >
                                        <option value="">-- Select a month --</option>
                                        {monthList.map((month, index) => (
                                            <option key={index} value={month}>
                                                {month}
                                            </option>
                                        ))}
                                    </Field>
                                </div>
                                <ErrorMessage name="month" component="div" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="year" className="form-label required">
                                    Select Year
                                </label>
                                <div className="select-wrapper">
                                    <Field
                                        as="select"
                                        id="year"
                                        name="year"
                                        className="form-control-custom"
                                    >
                                        <option value="">-- Select a year --</option>
                                        {yearList.map((year, index) => (
                                            <option key={index} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </Field>
                                </div>
                                <ErrorMessage name="year" component="div" className="form-error" />
                            </div>
                        </div>

                        <div className="form-group form-grid-full">
                            <label htmlFor="earning" className="form-label required">
                                Monthly Earning
                            </label>
                            <Field
                                id="earning"
                                name="earning"
                                type="number"
                                placeholder="Enter your monthly earning amount"
                                className="form-control-custom"
                            />
                            <ErrorMessage name="earning" component="div" className="form-error" />
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={isSubmitting || !isValid}
                            >
                                <FaPlus /> Add Month
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddMonth;