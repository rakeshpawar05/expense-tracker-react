import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const {isLogged, logout} = useAuth();
    const navigate = useNavigate();

    const handleOnClick = (e) => {
        logout()
        console.log("handlechange")
        navigate("/");
    }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">
          Expense Tracker
        </Link>
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
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/expenses">
                Expenses
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categories">
                Categories
              </Link>
            </li>
            {isLogged ? (<li className="nav-item">
              {/* <Link className="nav-link" to="/categories"> */}
                <button onClick={() => handleOnClick()}>logout</button>
              {/* </Link> */}
            </li>) : <div>hey</div> }

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;