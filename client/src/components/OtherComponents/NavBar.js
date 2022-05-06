import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div>
      <div className="logo">TabSplitter</div>
      <nav className="item">
        <ul className="navbar-list">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/contacts">Contacts</Link>
          </li>
          <li>
            <Link to="/bills">Bills</Link>
          </li>
          <li>
            <Link to="/debts">Debts</Link>
          </li>
          <li>
            <Link to="/quickcalc">Quick Calculator</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
