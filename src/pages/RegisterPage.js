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
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 w-100" style={{ maxWidth: "500px" }}>
                <h2 className="text-center">Register</h2>
                <Formik
                    initialValues={{ name: "", email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, errors }) => (
                        <Form>
                            {errors.general && <div className="alert alert-danger">{errors.general}</div>}
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Username</label>
                                <Field
                                    name="name"
                                    type="text"
                                    id="name"
                                    className="form-control"
                                />
                                <ErrorMessage name="name" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <Field
                                    name="email"
                                    type="email"
                                    id="email"
                                    className="form-control"
                                />
                                <ErrorMessage name="email" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <Field
                                    name="password"
                                    type="password"
                                    id="password"
                                    className="form-control"
                                />
                                <ErrorMessage name="password" component="div" className="text-danger" />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Registering..." : "Register"}
                            </button>
                        </Form>
                    )}
                </Formik>
                <div className="mt-3 text-center">
                    <p>Already have an account?</p>
                    <button className="btn btn-link" onClick={() => navigate("/")}>Login</button>
                </div>
            </div>
        </div>
    );
};

export default Register;
