import React from "react";
import { useAuth } from "../Auth/AuthContext";
import { usePing } from "../hooks/pingContext";
import { useLocation } from "react-router-dom";
import { FaSearch, FaBell, FaUser, FaBars, FaTimes } from "react-icons/fa";
import "./layout.css";

const MainLayout = ({ children, isMobileMenuOpen = false, onMobileMenuToggle = () => {} }) => {
  const { userDetails } = useAuth();
  const { isBackendActive } = usePing();
  const location = useLocation();
  const [profileDropdown, setProfileDropdown] = React.useState(false);

  const pageTitleMap = {
    "/dashboard": "Dashboard",
    "/expenses": "Expenses",
    "/months": "Months",
    "/savings": "Savings",
    "/categories": "Categories",
    "/events": "Events",
    "/chatbot": "AI Chatbot",
  };

  const pageTitle = pageTitleMap[location.pathname] || "Dashboard";

  const userName = userDetails?.name || "User";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="main-layout">
      <header className="app-header">
        <div className="header-content">
          <button
            className="mobile-menu-btn"
            onClick={onMobileMenuToggle}
            title={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <div className="header-title">
            <h2>{pageTitle}</h2>
          </div>

          <div className="header-right">
            <div className="status-indicator">
              <span
                className={`status-dot ${isBackendActive ? "active" : ""}`}
                title={isBackendActive ? "Backend Active" : "Backend Inactive"}
              ></span>
            </div>

            <button className="header-icon-btn" title="Notifications">
              <FaBell />
              <span className="notification-badge">3</span>
            </button>

            <div className="profile-wrapper">
              <button
                className="profile-btn"
                onClick={() => setProfileDropdown(!profileDropdown)}
              >
                <div className="profile-avatar">{userInitials}</div>
                <span className="profile-name">{userName}</span>
              </button>

              {profileDropdown && (
                <div className="profile-dropdown">
                  <div className="dropdown-item">
                    <FaUser /> Profile
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item">Settings</div>
                  <div className="dropdown-item">Help</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="app-content">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
