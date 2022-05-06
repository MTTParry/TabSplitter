import React from "react";
import { Nav, NavLink, Bars, NavMenu } from "./NavbarElements";

const NavBar = () => {
  return (
    <>
      <Nav>
        <Bars />
        <NavMenu>
          <NavLink to="/" activeStyle>
            TabSplitter
          </NavLink>
          
          <NavLink to="/contacts" activeStyle>
            Contacts
          </NavLink>

          <NavLink to="/bills" activeStyle>
            Bills
          </NavLink>
          
          <NavLink to="/debts" activeStyle>
            Debts
          </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};

export default NavBar;