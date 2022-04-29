import { useState } from "react";

const emptyContact = {
  firstname: "",
  lastname: "",
  email: "",
  preferred_payment_method: "",
};

const ContactForm = (props) => {
  //An initial student if there is one in props
  const { initialContact = { ...emptyContact } } = props;

  // Initial State
  const [contact, setContact] = useState(initialContact);

  //create functions that handle the event of the user typing into the form
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setContact((contact) => ({ ...contact, [name]: value }));
    //console.log("client side", contact);
  };

  //A function to handle the POST request
  const postNewContact = (newContact) => {
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
  };

  //A function to handle the PUT request
  const updateContactInfo = async (existingContact) => {
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (contact.contact_id) {
      updateContactInfo(contact);
    } else {
      postNewContact(contact);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>New Contact</h3>
      <fieldset>
        <label>First Name: </label>
        <input
          type="text"
          id="add-contact-firstname"
          className="contact_inputs"
          placeholder="Tab"
          required
          value={contact.firstname}
          onChange={handleChange}
          name="firstname"
        />
        <br />

        <label>Last Name: </label>
        <input
          type="text"
          id="add-contact-lastname"
          className="contact_inputs"
          placeholder="Splitter"
          value={contact.lastname}
          onChange={handleChange}
          name="lastname"
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
