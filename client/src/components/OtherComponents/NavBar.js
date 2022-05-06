import React from "react";
import { Nav, NavLink, Bars, NavMenu } from "./NavbarElements";

const NavBar = () => {
  return (
    <>
      <Nav>
        <Bars />
        <NavMenu>
          <NavLink exact to="/" activeStyle={{ fontWeight: "bold" }}>
            TabSplitter
          </NavLink>

          <NavLink exact to="/contacts" activeStyle={{ fontWeight: "bold" }}>
            Contacts
          </NavLink>

          <NavLink
            exact
            to="/contactsform"
            activeStyle={{ fontWeight: "bold" }}
          >
            Add Contact
          </NavLink>

          <NavLink exact to="/bills" activeStyle={{ fontWeight: "bold" }}>
            Bills
          </NavLink>

          <NavLink exact to="/billsform" activeStyle={{ fontWeight: "bold" }}>
            Add Bill
          </NavLink>

          <NavLink exact to="/debts" activeStyle={{ fontWeight: "bold" }}>
            Debts
          </NavLink>

          <NavLink exact to="/debtsform" activeStyle={{ fontWeight: "bold" }}>
            Add Debt
          </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};

export default NavBar;
