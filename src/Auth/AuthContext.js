import React, { useState, useContext } from "react";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState({
        token: null,
        user: null,
    });

    const doLogin = (token, user) => {
        console.log("received user" + user)
        setAuth({ token, user });
        localStorage.setItem("jwtToken", token);
        // console.log(isLoggedIn)
        console.log("token " + localStorage.getItem("jwtToken"))
        console.log("auth details" + auth.user)
    }
    const logout = () => {
        // setIsLoggedIn(false);
        console.log("user logged out successful")
        setAuth({ token: null, user: null });
        localStorage.removeItem("jwtToken")
        // console.log("token "+ localStorage.getItem("jwtToken"))
    }

    const isLogged = !!localStorage.getItem("jwtToken");
    // const isLogged = !!auth.token;

    const value = {
        isLogged,
        doLogin,
        logout
    }

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    )
}






