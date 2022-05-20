import { useState } from "react";
import ContactDropDown from "../DropDowns/ContactDropList";
import BillDropDown from "../DropDowns/BillDropList";
import EmptyDebt from "./EmptyDebt";
import EmptyBill from "../Bills/EmptyBill";
import { GetDebtTotal } from "../helper/FindDebtTotal";

const DebtForm = (props) => {
  //An initial student if there is one in props
  const { initialDebt } = props;

  // Initial State
  const [debt, setDebt] = useState(initialDebt || EmptyDebt);
  const [bill, setBill] = useState(EmptyBill);
  const [showDebtAddedMsg, setShowDebtAddedMsg] = useState();
  const [prevDebtInfo, setPrevDebtInfo] = useState();

  //create functions that handle the event of the user typing into the form
  const handleBillChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setDebt((debt) => ({ ...debt, [name]: value }));

    fetch(`http://localhost:5005/db/bill/${value}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Did this return the bill?", data);
        setBill(data);
      })
      .catch((err) => {
        console.log("Error fetching Bill: ", err);
        setBill(EmptyBill);
      });
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setDebt((debt) => {
      let tempDebt = { ...debt, [name]: value };

      tempDebt.how_much = GetDebtTotal(bill, tempDebt.subtotal);

      return tempDebt;
    });
    console.log("Contact, client side: " + name + ", value: " + value);
  };

  //A function to handle the POST request
  const postNewDebt = (newDebt) => {
    try {
      return fetch("/db/debts", {
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
    } catch (e) {
      console.log("debt Post error", e.message);
    }
  };

  //A function to handle the PUT request
  const updateDebtInfo = async (existingDebt) => {
    try {
      return fetch(`/db/debts/${existingDebt.debt_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(existingDebt),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log("The updated debt info: ", data);
          props.onSave(data);
        });
    } catch (e) {
      console.log("debt Put error", e.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      console.log({ initialDebt });
      console.log(debt.debt_id);
      if (debt.debt_id) {
        updateDebtInfo(debt);
      } else {
        postNewDebt(debt);
        setPrevDebtInfo(debt.how_much);
        setShowDebtAddedMsg(true);
        setDebt(EmptyDebt);
      }
    } catch (e) {
      console.log("add/submit button error", e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{!debt.debt_id ? "New Debt" : "Edit Debt"}</h3>
      <fieldset>
        <BillDropDown
          label="Which Bill:"
          id="add-debt-which-bill"
          name="which_bill"
          className="debt_inputs"
          required
          value={debt.which_bill}
          handleChange={handleBillChange}
        />
        <ContactDropDown
          label="Who owes:"
          id="add-debt-who-owes"
          name="who_owes"
          className="debt_inputs"
          required
          value={debt.who_owes}
          handleChange={handleChange}
        />
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
        Total Amount: ${debt.how_much}
        <br />
        <label>Have they been paid back? </label>
        <input
          type="radio"
          id="add-debt-paid-status-false"
          name="debt_paid_up"
          className="debt_inputs"
          required
          defaultChecked={debt.debt_paid_up === false}
          value={false}
          onChange={handleChange}
        />{" "}
        <label>No</label>
        <input
          type="radio"
          id="add-debt-paid-status-true"
          name="debt_paid_up"
          className="debt_inputs"
          required
          defaultChecked={debt.debt_paid_up === true}
          value={true}
          onChange={handleChange}
        />{" "}
        <label>Yes</label>
        <br />
        <label>Notes: </label>
        <textarea
          type="text"
          rows="5"
          id="add-debt-notes"
          name="debt_notes"
          className="debt_inputs"
          placeholder="Any details about the debt, such as what the person got and item costs"
          value={debt.debt_notes}
          onChange={handleChange}
        />
      </fieldset>
      <button type="submit" className="addbutton">
        {!debt.debt_id ? "Add Debt" : "Save Changes"}
      </button>
      <div>
        {showDebtAddedMsg ? (
          <p className="post_success">
            Debt of ${prevDebtInfo} Added!
            <br />
            Email sent to the person who owes!
          </p>
        ) : (
          ""
        )}
      </div>
    </form>
  );
};

export default DebtForm;
