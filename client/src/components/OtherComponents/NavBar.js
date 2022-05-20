import React from "react";
import { useState, useEffect } from "react";
import { Nav, NavLink, NavMenu } from "./NavbarElements";
import Login from "../Auth/login";

const NavBar = () => {
  const [user, setUser] = useState(undefined);

  const loadUser = () => {
    fetch("/api/me")
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          return undefined;
        }
      })
      .then((user) => {
        setUser(user);
      });
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <>
      {" "}
      {user ? (
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
          <Login user={user} />
        </Nav>
      ) : (
        <Nav>
          <NavMenu>
            <NavLink exact to="/">
              TabSplitter
            </NavLink>
          </NavMenu>
          <Login user={user} />
        </Nav>
      )}
    </>
  );
};

export default NavBar;
