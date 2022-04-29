import React from "react";
import { useState, useEffect } from "react";
import ContactForm from "./ContactForm";

const emptyContact = {
  firstname: "",
  lastname: "",
  email: "",
  preferred_payment_method: "",
};

function ContactList() {
  //This needs an empty array, or the whole thing breaks
  const [contacts, setContacts] = useState([]);
  const [editContactById, setEditContactById] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5005/db/contacts")
      .then((response) => response.json())
      .then((contactData) => {
        setContacts(contactData);
      });
  }, []);

  //  const deleteP Contacts
  const deleteContact = async (contact_id) => {
    try {
      const deleteResponse = await fetch(
        `http://localhost:5005/db/contacts/${contact_id}`,
        {
          method: "DELETE",
        }
      );
      if (deleteResponse.status === 200) {
        setContacts(
          contacts.filter((contact) => contact.contact_id !== contact_id)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  //PUT stuff
  // grabs the id of the post to be editted
  const editContact = (contact) => {
    const editId = contact.contact_id;
    console.log(editId);
    setEditContactById(editId);
  };

  const updateContact = async (updatedContactInfo) => {
    setContacts((contacts) => {
      const newListContacts = [];
      for (let contact of contacts) {
        if (contact.contact_id === updatedContactInfo.contact_id) {
          newListContacts.push(updatedContactInfo);
        } else {
          newListContacts.push(contact);
        }
      }
      return newListContacts;
    });

    setEditContactById(null);
  };

  return (
    <div className="ts_lists">
      <h2> Contacts List </h2>

      {contacts.map((contact) => {
        if (contact.contact_id === editContactById) {
          return <ContactForm initialPost={contact} savePost={updateContact} />;
        } else {
          return (
            <div className="card" key={contact.contact_id}>
              <h2>
                {contact.first_name} {contact.last_name}
              </h2>
              <ul className="contact-info">
                <li>
                  Email: <b>{contact.email}</b>
                </li>
                <li>
                  How to pay them: <b>{contact.preferred_payment_method}</b>
                </li>
              </ul>

              <button
                className="editbuttons"
                key={contact.contact_id}
                value={contact.contact_id}
                onClick={() => editContact(contact.contact_id)}
              >
                EDIT {contact.first_name}
              </button>

              <button
                className="deletebuttons"
                key="delete_${contact.contact_id}"
                value={contact.contact_id}
                onClick={() => deleteContact(contact.contact_id)}
              >
                DELETE {contact.first_name}
              </button>
              <div className="note">CAREFUL: Delete cannot be undone.</div>
              <hr />
            </div>
          );
        }
      })}
    </div>
  );
}

export default ContactList;
