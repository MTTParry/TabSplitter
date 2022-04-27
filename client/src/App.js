import "./App.css";
import ListContacts from "./components/Contacts/ContactsList";
import AddContact from "./components/Contacts/AddContactsForm";

function App() {
  return (
    <div className="App">
      TabSplitter
      <ListContacts />
      <AddContact />
    </div>
  );
}

export default App;
