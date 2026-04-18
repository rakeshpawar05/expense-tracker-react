import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../Auth/AuthContext";
import { getFullUser } from "../api/AxiosService";
import { FaUser, FaLock } from "react-icons/fa";
import "./../styles/loginpage.css";

const LoginPage = () => {
    const { doLogin, userDetails, setUserDetails } = useAuth();
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
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="login-icon">
                            <FaUser />
                        </div>
                        <h1 className="login-title">Welcome Back</h1>
                        <p className="login-subtitle">Sign in to your account</p>
                    </div>

                    {loginError && (
                        <div className="error-alert">
                            <span>{loginError}</span>
                        </div>
                    )}

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values }) => (
                            <Form className="login-form">
                                <div className="form-group">
                                    <label htmlFor="userName" className="form-label">Email</label>
                                    <div className="input-wrapper">
                                        <FaUser className="input-icon" />
                                        <Field
                                            type="email"
                                            id="userName"
                                            name="userName"
                                            className="form-input"
                                            placeholder="Enter your email"
                                            value={values.userName}
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="userName"
                                        component="div"
                                        className="error-message"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <div className="input-wrapper">
                                        <FaLock className="input-icon" />
                                        <Field
                                            type="password"
                                            id="password"
                                            name="password"
                                            className="form-input"
                                            placeholder="Enter your password"
                                            value={values.password}
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="error-message"
                                    />
                                </div>

                                <button type="submit" className="btn-login">
                                    Sign In
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <div className="login-footer">
                        <p>Don't have an account? <button className="link-button" onClick={onClickRegister}>Create one</button></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
