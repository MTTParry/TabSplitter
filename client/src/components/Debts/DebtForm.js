import { useState } from "react";
import ContactDropDown from "../DropDowns/ContactDropList";

const emptyDebt = {
  which_bill: null,
  subtotal: null,
  how_much: null,
  who_paid: null,
  who_owes: null,
  debt_paid_up: null,
  notes: "",
};

const DebtForm = (props) => {
  //An initial student if there is one in props
  const { initialDebt = { ...emptyDebt } } = props;

  // Initial State
  const [debt, setDebt] = useState(initialDebt);

  //create functions that handle the event of the user typing into the form
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setDebt((debt) => ({ ...debt, [name]: value }));
    console.log("client side", name, value);
  };

  //A function to handle the POST request
  const postNewDebt = (newDebt) => {
    return fetch("http://localhost:5005/db/debts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDebt),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("From the debt add ", data);
        // props.addPost(data);
      });
  };

  //A function to handle the PUT request
  const updateDebtInfo = async (existingDebt) => {
    return fetch(`http://localhost:5005/db/debts/${existingDebt.debt_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(existingDebt),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("The updated debt info: ", data);
        props.updateContact(data);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (debt.debt_id) {
      updateDebtInfo(debt);
    } else {
      postNewDebt(debt);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>New Debt</h3>
      <fieldset>
        <label>Subtotal: $</label>
        <input
          type="number"
          id="add-debt-subtotal"
          className="debt_inputs"
          placeholder="0"
          required
          value={debt.subtotal}
          onChange={handleChange}
          name="subtotal"
        />
        <br />
        <label>Total Amount: $</label>
        <input
          type="number"
          id="add-debt-tax_amount"
          className="debt_inputs"
          placeholder="0"
          value={debt.how_much}
          onChange={handleChange}
          name="how_much"
        />
        <br />
        <ContactDropDown
          label="Who Paid: "
          name="who_paid"
          id="add-debt-who-paid"
          className="debt_inputs"
          placeholder="0"
          required
          value={debt.who_paid}
          onChange={handleChange}
        />
        <br />
        <label>Which Bill: </label>
        <input
          type="integer"
          id="add-debt-which-bill"
          name="which_bill"
          className="debt_inputs"
          placeholder="0"
          required
          value={debt.which_bill}
          onChange={handleChange}
        />
        <br />
        <ContactDropDown
          label="Who owes:"
          id="add-debt-who-owes"
          name="who_owes"
          className="debt_inputs"
          placeholder="0"
          required
          value={debt.who_owes}
          onChange={handleChange}
        />
        <br />
        <label>Have they been paid back? </label>
        <input
          type="radio"
          id="add-debt-paid-status-false"
          name="debt_paid_up"
          className="debt_inputs"
          required
          value={debt.debt_paid_up}
          onChange={handleChange}
        />{" "}
        <label>No</label>
        <input
          type="radio"
          id="add-debt-paid-status-true"
          name="debt_paid_up"
          className="debt_inputs"
          required
          value={debt.debt_paid_up}
          onChange={handleChange}
        />{" "}
        <label>Yes</label>
        <br />
        <label>Notes: </label>
        <input
          type="text"
          id="add-debt-notes"
          name="notes"
          className="debt_inputs"
          placeholder="Any details about the debt, such as what the person got and item costs"
          value={debt.debt_notes}
          onChange={handleChange}
        />
      </fieldset>
      <button type="submit">
        {!debt.debt_id ? "Add Debt" : "Save Changes"}
      </button>
    </form>
  );
};

export default DebtForm;
