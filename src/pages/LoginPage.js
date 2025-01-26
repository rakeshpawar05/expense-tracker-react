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
        // Mock authentication - store a fake JWT token
        console.log(typeof (values))
        console.log(JSON.stringify(values))
        console.log("login called " + values.password + " " + values.userName);
        // const response = await login(JSON.stringify(values))
        await login(JSON.stringify(values))
            .then((response) => {
                console.log("Login successful:", response.data); // Handle successful login
                //   setToken(response.data.token); // Example: Save the token
                // localStorage.setItem("jwtToken", response.data);
                // setIsLoggedIn(true)
                doLogin(response.data, "rakesh")

            })
            .catch((error) => {
                console.error("Login failed:", error.response?.data || error.message);
                //   setError("Invalid username or password");
            });
        // console.log(response);

        console.log("local " + localStorage.getItem("jwtToken"))
        console.log("logged "+ isLogged)
        // const amount = getAmount(1);
        await getAmount(1).then((response) => {
            console.log("amount " + response.data)
        })
        // console.log("amount "+ amount.data)
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