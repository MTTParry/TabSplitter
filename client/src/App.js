import "./App.css";
import React from "react";
import ContactForm from "./components/Contacts/ContactForm";
import ContactList from "./components/Contacts/ContactList";
import BillList from "./components/Bills/BillList";
import BillForm from "./components/Bills/BillForm";

function App() {
  return (
    <div className="App">
      <h1>TabSplitter</h1>
      <ContactList />
      <ContactForm />
      <BillList />
      <BillForm />
    </div>
  );
}

export default App;
