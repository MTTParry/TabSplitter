import "./App.css";
import React from "react";
import ContactForm from "./components/Contacts/ContactForm";
import ContactList from "./components/Contacts/ContactList";

function App() {
  return (
    <div className="App">
      <h1>TabSplitter</h1>
      <ContactList />
      <ContactForm />
    </div>
  );
}

export default App;
