import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import {
  FaHome,
  FaReceipt,
  FaCalendar,
  FaTags,
  FaCalendarAlt,
  FaSignOutAlt,
  FaPiggyBank,
  FaComments,
} from "react-icons/fa";
import "./sidebar.css";

const Sidebar = ({ isMobileOpen = false, onMobileClose = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      label: "Expenses",
      path: "/expenses",
      icon: <FaReceipt />,
    },
    {
      label: "Month",
      path: "/months",
      icon: <FaCalendar />,
    },
    {
      label: "Categories",
      path: "/categories",
      icon: <FaTags />,
    },
    {
      label: "Events",
      path: "/events",
      icon: <FaCalendarAlt />,
    },
    {
      label: "Savings",
      path: "/savings",
      icon: <FaPiggyBank />,
    },
    {
      label: "Chatbot",
      path: "/chatbot",
      icon: <FaComments />,
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    onMobileClose();
  };

  return (
    <>
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={onMobileClose}></div>
      )}
      <div className={`sidebar ${isMobileOpen ? "show" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo" onClick={() => handleNavigation("/dashboard")}>
          <span className="logo-icon">💰</span>
          <span className="logo-text">Expense Tracker</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`sidebar-nav-item ${isActive(item.path) ? "active" : ""}`}
            onClick={() => handleNavigation(item.path)}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
    </>
  );
};

export default Sidebar;
