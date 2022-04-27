import React from "react";
import { useState, useEffect } from "react";

function ListContacts() {
  //This needs an empty array, or the whole thing breaks
  const [contacts, setContacts] = useState([]);
  const [editContact, setEditContact] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5005/db/contactss")
      .then((response) => response.json())
      .then((contact_list) => {
        setContacts(contact_list);
      });
  }, []);

  //PUT stuff
  // grabs the id of the post to be editted
  const editContactById = (contactById) => {
    const editContact = contactById.id;
    console.log(editContact);
    setEditContact(editContact);
  };

  const updateContact = async (updatedContact) => {
    setContacts((contacts) => {
      const newListContacts = [];
      for (let person of contacts) {
        if (person.id === updatedContact.id) {
          newListContacts.push(updatedContact);
        } else {
          newListContacts.push(person);
        }
      }
      return newListPosts;
    });

    setEditContact(null);
  };

  return (
    <div className="contact_list">
      <h2> List of Contacts </h2>

      {contacts.map((each_contact) => {
        if (each_contact.id === editContactById) {
          return <AddContact initialPost={post} savePost={updatePost} />;
        } else {
          return (
            <div className="card" key={post.id}>
              <h2>{contact.firstname} {contact.lastname}</h2>
              <ul className="contact_details">
                <li>
                    Email: {contact.email}
                </li>
                <li>How they like to be paid: {contact.preferred_payment_method}</li>
              </ul>
              <br />

              <button
                className="editbuttons"
                key={contact.contact_id}
                value={contact.contact_id}
                onClick={() => updateContact(contact)}
              >
                EDIT Contact
              </button>

              <button
                className="deletebuttons"
                key={post.id}
                value={post.id}
                onClick={() => deletePost(post.id)}
              >
                DELETE Contact
              </button>
              <div className="note">CAREFUL: Delete cannot be undone.</div>
            </div>
          );
        }
      })}
    </div>
  );
}

export default ListContacts;
