import React from "react";
import { Nav, NavLink, Bars, NavMenu } from "./NavbarElements";

const NavBar = () => {
  return (
    <>
      <Nav>
        <Bars />
        <NavMenu>
          <NavLink exact to="/" activeStyle={{fontWeight: "bold"}}>
            TabSplitter
          </NavLink>
          
          <NavLink exact to="/contacts" activeStyle={{fontWeight: "bold"}}>
            Contacts
          </NavLink>

          <NavLink exact to="/bills" activeStyle={{fontWeight: "bold"}}>
            Bills
          </NavLink>
          
          <NavLink exact to="/debts" activeStyle={{fontWeight: "bold"}}>
            Debts
          </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};

export default NavBar;