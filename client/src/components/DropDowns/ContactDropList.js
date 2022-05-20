import { useState, useEffect } from "react";

const ContactDropDown = (prop) => {
  const [contactList, setContactList] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch(`/db/contacts`)
      .then((response) => response.json())
      .then((contactList) => {
        setContactList(contactList);
        // setReady(true);
      });
  }, []);

  useEffect(() => {
    setReady(true);
  }, [contactList]);

  //Listing Contacts
  if (ready) {
    return (
      <div>
        <label>{prop.label}</label>
        {"      "}
        <select onChange={prop.handleChange} name={prop.name} required>
          <option hidden>Select</option>
          {contactList.map((contact) => (
            <option value={contact.contact_id} key={contact.contact_id}>
              {contact.first_name} {contact.last_name}
            </option>
          ))}
        </select>
      </div>
    );
  } else {
    return <div>Drop Down is loading</div>;
  }
};

export default ContactDropDown;
