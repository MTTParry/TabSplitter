import "./App.css";
import React from "react";
import NavBar from "./components/OtherComponents/NavBar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/OtherComponents/HomeAbout";
import ContactList from "./components/Contacts/ContactList";
import BillList from "./components/Bills/BillList";
import DebtList from "./components/Debts/DebtList";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <div>
          <Switch>
            <Route exact path="/" element={<Home />} />
            <Route path="/contacts" element={<ContactList />} />
            <Route path="/bills" element={<BillList />} />
            <Route path="/debts" element={<DebtList />} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
