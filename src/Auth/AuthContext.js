import React, { useState, useContext, useEffect } from "react";
import { loginApi } from "../api/AxiosService";
// import { useNavigate } from "react-router-dom";
import { monthList } from "../components/month/MonthNameList";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {

    // const navigate = useNavigate();
    // const navigate = useNavigate();

    const logout = () => {
        console.log("user logged out successful")
        setUserDetails((userDetails) => ({
            ...userDetails,
            "userId": 0,
            "name": "",
            "token": ""
        }))
        localStorage.removeItem("jwtToken")
        sessionStorage.removeItem("pageReloaded");
    }

    useEffect(() => {
        // Remove user data and redirect on page load
        // localStorage.removeItem("authToken"); // Clear stored token or session
        // sessionStorage.removeItem("authToken");
        // setUser(null);
        const isPageReloaded = sessionStorage.getItem("pageReloaded");

        if (!isPageReloaded) {
            // logout();
            setUserDetails((userDetails) => ({
                ...userDetails,
                "userId": 0,
                "name": "",
                "token": ""
            }))
            localStorage.removeItem("jwtToken")
            sessionStorage.setItem("pageReloaded", "true");
            window.location.href = "/"; // Redirect to login page
        }
    }, []);

    const [userDetails, setUserDetails] = useState({
        "userId": 0,
        "name": "",
        "token": "",
        "months": [],
        "categories": [],
        "expenses": []
    })

    const [currentMonth, setCurrentMonth] = useState('');
    const [listOfAvailableMonths, setListOfAvailableMonths] = useState([]);

    const doLogin = async (values) => {
        try {
            const response = await loginApi(JSON.stringify(values));

            // If login is successful, set user details and store the token
            console.log("Login successful:", response.data);
            setUserDetails((userDetails) => ({
                ...userDetails,
                userId: response.data.userId,
                name: response.data.name,
                token: response.data.token,
            }));


            const date = new Date();
            console.log(monthList[date.getMonth()])
            setCurrentMonth(monthList[date.getMonth()] + "," + date.getFullYear())
            console.log("setting default month " + currentMonth)
            sessionStorage.removeItem("pageReloaded"); 


            localStorage.setItem("jwtToken", response.data.token);
        } catch (error) {
            // If login fails, throw an error with the message
            console.error("Login failed:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || "Bad credentials...Try Again!!!"); // Throwing error to be caught in the LoginPage
        }
    };


    // const doLogin = async (values) => {
    //     await loginApi(JSON.stringify(values))
    //         .then((response) => {
    //             console.log("Login successful:", response.data); // Handle successful login
    //             // doLogin(response.data, "rakesh")
    //             setUserDetails((userDetails) => ({
    //                 ...userDetails, ["userId"]: response.data.userId,
    //                 ["name"]: response.data.name, ["token"]: response.data.token
    //             }))
    //             localStorage.setItem("jwtToken", response.data.token);
    //         })
    //         .catch((error) => {
    //             console.error("Login failed:", error.response?.data || error.message);
    //         });;
    //     console.log("user logged in sccessful")
    //     console.log("user details " + userDetails);

    //     // navigate("/dashboard");
    // }

    useEffect(() => {

        console.log("Changed user details : ", userDetails)

    }, [userDetails])

    const isLogged = !!localStorage.getItem("jwtToken");

    const value = {
        isLogged,
        doLogin,
        logout,
        userDetails,
        currentMonth,
        setCurrentMonth,
        listOfAvailableMonths,
        setListOfAvailableMonths,
        setUserDetails
    }

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    )
}






