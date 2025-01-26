import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

const ProtectedRoute = ({ children }) => {

    const {isLogged} = useAuth();

  if (!isLogged) {
    // If user is not authenticated, redirect to login
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the child component
  return children;
};

export default ProtectedRoute;