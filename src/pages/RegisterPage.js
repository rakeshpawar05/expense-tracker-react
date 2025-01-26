import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../api/AxiosService";

const Register = () => {
    const navigate = useNavigate();

    // Validation Schema
    const validationSchema = Yup.object({
        name: Yup.string().required("Username is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    });

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            console.log(values)
            await registerApi(values); // Call register API
            navigate("/"); // Redirect to login after success
        } catch (error) {
            setErrors({ general: error.response?.data?.message || "Registration failed. Try again." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Register</h2>
            <Formik
                initialValues={{ name: "", email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors }) => (
                    <Form>
                        {errors.general && <div className="alert alert-danger">{errors.general}</div>}
                        <div className="form-group">
                            <label htmlFor="name">Username</label>
                            <Field name="name" type="text" id="name" className="form-control" />
                            <ErrorMessage name="name" component="div" className="text-danger" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <Field name="email" type="email" id="email" className="form-control" />
                            <ErrorMessage name="email" component="div" className="text-danger" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <Field name="password" type="password" id="password" className="form-control" />
                            <ErrorMessage name="password" component="div" className="text-danger" />
                        </div>
                        <button type="submit" className="btn btn-primary mt-3" disabled={isSubmitting}>
                            {isSubmitting ? "Registering..." : "Register"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Register;
