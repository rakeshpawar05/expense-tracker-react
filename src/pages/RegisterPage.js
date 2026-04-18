import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../api/AxiosService";
import { FaUserPlus, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import "./../styles/registerpage.css";

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
            console.log(values);
            await registerApi(values); // Call register API
            navigate("/"); // Redirect to login after success
        } catch (error) {
            // console.log(" error " + error.response.data)
            error.response.status === 409 ? setErrors({ email: error.response.data}) : 
            setErrors({ general: error.response?.data?.message || "Registration failed. Try again." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-card">
                    <div className="register-header">
                        <div className="register-icon">
                            <FaUserPlus />
                        </div>
                        <h1 className="register-title">Create Account</h1>
                        <p className="register-subtitle">Join us to manage your expenses</p>
                    </div>

                    <Formik
                        initialValues={{ name: "", email: "", password: "" }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, errors }) => (
                            <Form className="register-form">
                                {errors.general && (
                                    <div className="error-alert">
                                        <span>{errors.general}</span>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">Full Name</label>
                                    <div className="input-wrapper">
                                        <FaUser className="input-icon" />
                                        <Field
                                            name="name"
                                            type="text"
                                            id="name"
                                            className="form-input"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <ErrorMessage name="name" component="div" className="error-message" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <div className="input-wrapper">
                                        <FaEnvelope className="input-icon" />
                                        <Field
                                            name="email"
                                            type="email"
                                            id="email"
                                            className="form-input"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <ErrorMessage name="email" component="div" className="error-message" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <div className="input-wrapper">
                                        <FaLock className="input-icon" />
                                        <Field
                                            name="password"
                                            type="password"
                                            id="password"
                                            className="form-input"
                                            placeholder="Create a password"
                                        />
                                    </div>
                                    <ErrorMessage name="password" component="div" className="error-message" />
                                </div>

                                <button
                                    type="submit"
                                    className="btn-register"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Creating Account..." : "Create Account"}
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <div className="register-footer">
                        <p>Already have an account? <button className="link-button" onClick={() => navigate("/")}>Sign in</button></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
