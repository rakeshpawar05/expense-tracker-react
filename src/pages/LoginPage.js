import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../Auth/AuthContext";
import { getFullUser } from "../api/AxiosService";

const LoginPage = () => {
    const { isLogged, doLogin, userDetails, setUserDetails } = useAuth();
    const navigate = useNavigate();
    
    const [loginError, setLoginError] = useState(null); // State to hold error message

    const initialValues = {
        userName: "",
        password: "",
    };

    const validationSchema = Yup.object({
        userName: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
    });

    const onClickRegister = () => {
        navigate('/register');
    }

    const handleSubmit = async (values) => {
        setLoginError(null); // Reset any previous errors

        try {
            console.log(`url  ${process.env.REACT_APP_API_URL}`)
            await doLogin(values); // Try login
            navigate("/dashboard"); // Redirect on success
            // populateUser();
        } catch (error) {
            // If login fails, set the error message
            setLoginError(error.message);
        }
    };

    // useEffect(() => {
    //     populateUser();
    //     console.log("login page Changed user details : ", userDetails);
    // }, [userDetails]);

    const populateUser = async () => {
        try {            
            const userResponse = await getFullUser(userDetails.userId);
            console.log("full user " + JSON.stringify(userResponse.data));

            setUserDetails((userDetails) => ({
                ...userDetails,
                userId: userDetails.userId,
                name: userDetails.name,
                token: userDetails.token,
                months: userResponse.data.months,
                categories: userResponse.data.category,
                expenses: userResponse.data.expenses
            }));
        } catch (error) {
            console.log("Unable to populate user details")
        }
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 w-100" style={{ maxWidth: "500px" }}>
                <h2 className="text-center mb-4">Login</h2>
                {loginError && (
                    <div className="alert alert-danger text-center" role="alert">
                        {loginError}
                    </div>
                )}
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values }) => (
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
                                    placeholder="Enter your email"
                                    value={values.userName}
                                />
                                <ErrorMessage
                                    name="userName"
                                    component="div"
                                    className="text-danger mt-2"
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
                                    placeholder="Enter your password"
                                    value={values.password}
                                />
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="text-danger mt-2"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 mt-3">
                                Login
                            </button>
                        </Form>
                    )}
                </Formik>
                <div className="mt-3 text-center">
                    <div>Don't have an account?</div>
                    <button className="btn btn-link p-0" onClick={() => onClickRegister()}>Register here</button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
