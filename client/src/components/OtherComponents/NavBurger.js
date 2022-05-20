import React from "react";
import "./burger.css";
import { Link } from "react-router-dom";
import { slide as BurgerMenu } from 'react-burger-menu';

const NavBurger = ({
  outerContainerId,
  pageWrapId,
}) => {
  return (
    // This makes it so the menu only shows OVER the elements in pageWrapId??
    // <BurgerMenu pageWrapId={pageWrapId} outerContainerId={outerContainerId}>
    <BurgerMenu >
      <Link className="menu-item" exact to="/">
        TabSplitter
      </Link>

      <Link className="menu-item" exact to="/contacts">
        Contacts
      </Link>

      <Link className="menu-item" exact to="/contactsform">
        Add Contact
      </Link>

      <Link className="menu-item" exact to="/bills">
        Bills
      </Link>

      <Link className="menu-item" exact to="/billsform">
        Add Bill
      </Link>

      <Link className="menu-item" exact to="/debts">
        Debts
      </Link>

      <Link className="menu-item" exact to="/debtsform">
        Add Debt
      </Link>
    </BurgerMenu>
  );
};

export default NavBurger;
