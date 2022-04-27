import { useState } from "react";

const emptyContact = {
  firstname: "",
  lastname: "",
  email: "",
  preferred_payment_method: "",
};

const AddContact = (props) => {
  const { initialContact = { emptyContact } } = props;

  // Initial State
  const [contact, setContact] = useState(initialContact);

  //create functions that handle the event of the user typing into the form
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setContact((contact) => ({ ...contact, [name]: value }));
  };

  //A function to handle the POST request
  const postContact = (newContact) => {
    return fetch("http://localhost:5005/db/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("From the contact ", data);
        // props.addPost(data);
      });
  };

  //A function to handle the PUT request
  const updateContact = async (existingContact) => {
    return fetch(`http://localhost:5005/db/contacts/${existingContact.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(existingPost),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("From the post ", data);
        props.updatePost(data);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (contact.id) {
      updateContact(contact);
    } else {
      postContact(contact);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>New Contact</h3>
      <fieldset>
        <label>First Name</label>
        <br />
        <input
          type="text"
          id="add-contact-firstname"
          placeholder="First name"
          required
          name="contact-firstname"
          value={contact.firstname}
          onChange={handleChange}
        />
        <br />
        <label>Last Name</label>
        <br />
        <input
          type="text"
          id="add-contact-lastname"
          placeholder="Last name"
          className="contact-inputs"
          required
          value={contact.lastname}
          onChange={handleChange}
        />
        <br />
        <label>Email</label>
        <br />
        <input
          type="text"
          id="add-contact-email"
          placeholder="Name@gmail.com"
          required
          className="contact-inputs"
          value={contact.email}
          onChange={handleChange}
        />
        <br />
        <label>How this person prefers to be paid</label>
        <br />
        <textarea
          rows="5"
          className="contact-inputs"
          type="text"
          id="add-contact-preferred_payment_method"
          placeholder="Ex: Venmo (@name)"
          required
          name="preferred_payment_method"
          value={contact.preferred_payment_method}
          onChange={handleChange}
        />
        <br />
      </fieldset>
      <button type="submit">{!post.id ? "Add Contact" : "Save Changes"}</button>
    </form>
  );
};

export default AddContact;
