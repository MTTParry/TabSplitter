import { useState, useEffect } from "react";
import EmptyContact from "./EmptyContact";

const ContactForm = (props) => {
  //An initial student if there is one in props
  const { initialContact } = props;

  // Initial State
  const [contact, setContact] = useState(initialContact || EmptyContact);

  //create functions that handle the event of the user typing into the form
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setContact((contact) => ({ ...contact, [name]: value }));
    console.log("Contact - client side", contact);
  };

  //A function to handle the POST request
  const postNewContact = (newContact) => {
    try {
      return fetch("http://localhost:5005/db/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContact),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log("From the contact add ", data);
          // props.addPost(data);
        });
    } catch (e) {
      console.log("contact Post error", e.message);
    }
  };

  //A function to handle the PUT request
  const updateContactInfo = async (existingContact) => {
    try {
      return fetch(
        `http://localhost:5005/db/contacts/${existingContact.contact_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(existingContact),
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log("The updated contact info: ", data);
          props.updateContact(data);
        });
    } catch (e) {
      console.log("contact Put error", e.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      console.log({ initialContact });
      console.log(contact.contact_id);
      //consider adding "contact.hasOwnProperty(contact_id) &&
      if (contact.contact_id) {
        updateContactInfo(contact);
      } else {
        postNewContact(contact);
      }
    } catch (e) {
      console.log("add/submit button error", e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{!contact.contact_id ? "Add New Contact" : "Edit Contact"}</h3>
      <fieldset>
        <label>First Name: </label>
        <input
          type="text"
          id="add-contact-first-name"
          className="contact_inputs"
          placeholder="Tab"
          required
          value={contact.first_name}
          onChange={handleChange}
          name="first_name"
        />
        <br />

        <label>Last Name: </label>
        <input
          type="text"
          id="add-contact-last-name"
          className="contact_inputs"
          placeholder="Splitter"
          value={contact.last_name}
          onChange={handleChange}
          name="last_name"
        />
        <br />
        <label>Email: </label>
        <input
          type="text"
          id="add-contact-email"
          name="email"
          className="contact-inputs"
          placeholder="name@email.com"
          required
          value={contact.email}
          onChange={handleChange}
        />
        <br />
        <label>How this person likes to be paid: </label>
        <textarea
          rows="5"
          className="contact-inputs"
          name="preferred_payment_method"
          type="text"
          id="add-contact-payment-info"
          placeholder="Venmo (@name), Cash, CashApp (@name)"
          required
          value={contact.preferred_payment_method}
          onChange={handleChange}
        />
      </fieldset>
      <button type="submit">
        {!contact.contact_id ? "Add Contact" : "Save Changes"}
      </button>
    </form>
  );
};

export default ContactForm;
