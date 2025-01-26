import React, { useState, useContext } from "react";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {

    const doLogin = (token) => {
        console.log("user logged in sccessful")
        localStorage.setItem("jwtToken", token);
    }
    const logout = () => {
        console.log("user logged out successful")
        localStorage.removeItem("jwtToken")
    }

    const isLogged = !!localStorage.getItem("jwtToken");

    const value = {
        isLogged,
        doLogin,
        logout
    }

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    )
}






