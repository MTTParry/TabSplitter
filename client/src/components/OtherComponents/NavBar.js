import React from "react";
import { Nav, NavLink, Bars, NavMenu } from "./NavbarElements";

const NavBar = () => {
  return (
    <>
      <Nav>
    
        <NavMenu>
          <NavLink exact to="/">
            TabSplitter
          </NavLink>

          <NavLink exact to="/contacts">
            Contacts
          </NavLink>

          <NavLink exact to="/contactsform">
            Add Contact
          </NavLink>

          <NavLink exact to="/bills">
            Bills
          </NavLink>

          <NavLink exact to="/billsform">
            Add Bill
          </NavLink>

          <NavLink exact to="/debts">
            Debts
          </NavLink>

          <NavLink exact to="/debtsform">
            Add Debt
          </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};

export default NavBar;
