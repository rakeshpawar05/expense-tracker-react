import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { isLogged } = useAuth();

  if (!isLogged) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
