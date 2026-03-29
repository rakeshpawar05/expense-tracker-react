import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import { usePing } from "../hooks/pingContext";

const Navbar = () => {

  const { isLogged, logout } = useAuth();
  // const { isPinging, startPinging, stopPinging } = useKeepAlive();
  const { isBackendActive, startPinging, stopPinging, pinging } = usePing();
  const navigate = useNavigate();
  const location = useLocation();

  const closeNavbar = () => {
    const navbarCollapse = document.querySelector(".navbar-collapse.show");
    const navbarToggler = document.querySelector(".navbar-toggler");
    if (!navbarCollapse) return;

    const bootstrapCollapse =
      window.bootstrap?.Collapse?.getInstance(navbarCollapse) ||
      (window.bootstrap?.Collapse ? new window.bootstrap.Collapse(navbarCollapse) : null);

    if (bootstrapCollapse) {
      bootstrapCollapse.hide();
    } else {
      navbarCollapse.classList.remove("show");
      if (navbarToggler) {
        navbarToggler.classList.add("collapsed");
        navbarToggler.setAttribute("aria-expanded", "false");
      }
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("jwtToken")) {
      console.log("changing login status to " + isLogged);
    }
  }, [isLogged]);

  useEffect(() => {
    closeNavbar();
  }, [location.pathname]);

  const handleOnClick = () => {
    closeNavbar();
    logout();
    navigate("/");
  };

  const handleToggle = () => {
    pinging ? stopPinging() : startPinging();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/dashboard" onClick={closeNavbar}>
          Expense Tracker
        </Link>
        <div>
          {/* Status dot */}
          <span
            className="me-2"
            style={{
              height: "12px",
              width: "12px",
              borderRadius: "50%",
              backgroundColor: isBackendActive ? "limegreen" : "red",
              display: "inline-block",
            }}
            title={isBackendActive ? "Backend Active" : "Backend Inactive"}
          ></span>

          {/* Toggle */}
          <button
            onClick={handleToggle}
            className="btn btn-sm btn-outline-light"
            title={pinging ? "Pause keep-alive ping" : "Resume keep-alive ping"}
          >
            {pinging ? "⏸" : "▶️"}
          </button>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard" onClick={closeNavbar}>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/months" onClick={closeNavbar}>
                Months
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/expenses" onClick={closeNavbar}>
                Expenses
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/savings" onClick={closeNavbar}>
                Savings
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categories" onClick={closeNavbar}>
                Categories
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/events" onClick={closeNavbar}>
                Events
              </Link>
            </li>
            {isLogged ? (
              <li className="nav-item">
                <button className="nav-link" onClick={handleOnClick}>
                  Logout
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
