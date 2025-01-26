import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login, getAmount } from "../api/AxiosService";
import { useAuth } from "../Auth/AuthContext";

const LoginPage = () => {
    const { isLogged, doLogin } = useAuth();
    const navigate = useNavigate();

    const initialValues = {
        userName: "",
        password: "",
    };

    const validationSchema = Yup.object({
        userName: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
    });

    const handleSubmit = async (values) => {

        await login(JSON.stringify(values))
            .then((response) => {
                // console.log("Login successful:", response.data); // Handle successful login
                doLogin(response.data, "rakesh")
            })
            .catch((error) => {
                console.error("Login failed:", error.response?.data || error.message);
            });;
        navigate("/dashboard");
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 w-50">
                <h2 className="text-center">Login</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {(values) => (
                        <Form>
                            <div className="mb-3">
                                <label htmlFor="userName" className="form-label">
                                    Email
                                </label>
                                <Field
                                    type="email"
                                    id="userName"
                                    name="userName"
                                    className="form-control"
                                    value={values.userName}
                                />
                                <ErrorMessage
                                    name="userName"
                                    component="div"
                                    className="text-danger"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <Field
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="form-control"
                                    value={values.password}
                                />
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="text-danger"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">
                                Login
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default LoginPage;