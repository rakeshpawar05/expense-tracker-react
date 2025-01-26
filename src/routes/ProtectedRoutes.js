import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../Auth/auth";

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // If user is not authenticated, redirect to login
    console.log("unauth")
    return <Navigate to="/" replace />;
  }

  console.log("auth")
  // If authenticated, render the child component
  return children;
};

export default ProtectedRoute;