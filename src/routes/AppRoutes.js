// import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ExpensesPage from "../pages/ExpensePage";
import ProtectedRoute from "./ProtectedRoutes";
import Register from "../pages/RegisterPage";

const AppRoutes = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
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
                {/* <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
        /> */}
                <Route path="*" element={<h1>404 - Page Not Found</h1>} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;