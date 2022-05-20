import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import NavBar from "./components/OtherComponents/NavBar";
import NavBurger from "./components/OtherComponents/NavBurger";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/OtherComponents/HomeAbout";
import ContactList from "./components/Contacts/ContactList";
import BillList from "./components/Bills/BillList";
import DebtList from "./components/Debts/DebtList";
import ContactForm from "./components/Contacts/ContactForm";
import BillForm from "./components/Bills/BillForm";
import DebtForm from "./components/Debts/DebtForm";

function App() {
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
    <div className="App" id="outer-container">
      <Router>
        <NavBar />
        {/* This makes it so the menu only shows OVER the elements in pageWrapId?? */}
        {/* <NavBurger outerContainerId={'outer-container'} pageWrapId={'page-wrap'} /> */}
        {user ? <NavBurger /> : <></>}
        <div id="page-wrap">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/contacts" component={ContactList} />
            <Route path="/contactsform" component={ContactForm} />
            <Route path="/bills" component={BillList} />
            <Route path="/billsform" component={BillForm} />
            <Route path="/debts" component={DebtList} />
            <Route path="/debtsform" component={DebtForm} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
