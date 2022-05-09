import "./App.css";
import React from "react";
import NavBar from "./components/OtherComponents/NavBar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/OtherComponents/HomeAbout";
import ContactList from "./components/Contacts/ContactList";
import BillList from "./components/Bills/BillList";
import DebtList from "./components/Debts/DebtList";
import ContactForm from "./components/Contacts/ContactForm";
import BillForm from "./components/Bills/BillForm";
import DebtForm from "./components/Debts/DebtForm";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <div>
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
