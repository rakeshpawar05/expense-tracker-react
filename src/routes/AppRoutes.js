import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainLayout from "../components/Layout";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ExpensesPage from "../pages/ExpensePage";
import ProtectedRoute from "./ProtectedRoutes";
import Register from "../pages/RegisterPage";
import MonthsPage from "../pages/MonthPage";
import CategoryPage from "../pages/CategoryPage";
import EventPage from "../pages/EventPage";
import SavingsPage from "../pages/SavingPage";
import ChatbotPage from "../pages/ChatbotPage";

const RoutesContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/register";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {!isAuthPage && (
        <Sidebar isMobileOpen={isMobileMenuOpen} onMobileClose={handleMobileMenuClose} />
      )}
      {!isAuthPage && (
        <MainLayout
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={handleMobileMenuToggle}
        >
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/months"
              element={
                <ProtectedRoute>
                  <MonthsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <ExpensesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/savings"
              element={
                <ProtectedRoute>
                  <SavingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <CategoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <EventPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <ChatbotPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </MainLayout>
      )}
      {isAuthPage && (
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <RoutesContent />
    </Router>
  );
};

export default AppRoutes;