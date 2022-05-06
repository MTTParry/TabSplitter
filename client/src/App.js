import "./App.css";
import React from "react";
import { NavBar } from 


import ContactForm from "./components/Contacts/ContactForm";
import ContactList from "./components/Contacts/ContactList";
import BillList from "./components/Bills/BillList";
import BillForm from "./components/Bills/BillForm";
import DebtList from "./components/Debts/DebtList";
import DebtForm from "./components/Debts/DebtForm";

function App() {
  return (
    <div className="App">




      <h1>TabSplitter</h1>
      <hr />
      <hr />
      <BillList />
      <BillForm />
    </div>
  );
}

export default App;
