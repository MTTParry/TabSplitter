import { useState } from "react";
import ContactDropDown from "../DropDowns/ContactDropList";
import EmptyBill from "./EmptyBill";

import { GetTaxRate } from "../helper/FindTaxRate";
import { GetTipAmount } from "../helper/FindTipTotal";
import { GetTotal } from "../helper/FindTotal";

// IMPORTANT: Tip_rate is an integer, not a decimal.
//Remember to convert it before doing math with it.

const BillForm = (props) => {
  //An initial student if there is one in props
  const { initialBill } = props;

  // Initial State
  const [bill, setBill] = useState(initialBill || EmptyBill);
  const [showBillAddedMsg, setShowBillAddedMsg] = useState();
  const [prevBillInfo, setPrevBillInfo] = useState();

  //create functions that handle the event of the user typing into the form
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setBill((bill) => {
      let tempBill = { ...bill, [name]: value };

      tempBill.tax_rate = GetTaxRate(tempBill);

      tempBill.tip_total = GetTipAmount(tempBill);

      tempBill.full_total = GetTotal(tempBill);

      return tempBill;
    });
    console.log("Bill, client side: " + name + ", value: " + value);
  };

  //A function to handle the POST request
  const postNewBill = (newBill) => {
    try {
      return fetch("/db/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBill),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log("From the bill add ", data);
        });
    } catch (e) {
      console.log("bill Post error:", e.message);
    }
  };

  //A function to handle the PUT request
  const updateBillInfo = async (existingBill) => {
    try {
      return fetch(`/db/bills/${existingBill.bill_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(existingBill),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log("The updated bill info: ", data);
          props.onSave(data);
        });
    } catch (e) {
      console.log("bill Put error", e.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (bill.bill_id) {
        updateBillInfo(bill);
      } else {
        postNewBill(bill);
        setPrevBillInfo(bill.full_total);
        setShowBillAddedMsg(true);
        setBill(EmptyBill);
      }
    } catch (e) {
      console.log("add/submit button error", e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{!bill.bill_id ? "Add New Bill" : "Edit Bill"}</h3>
      <fieldset>
        <label>Subtotal: $</label>
        <input
          type="number"
          id="add-bill-subtotal"
          className="bill_inputs"
          placeholder="0"
          min="0"
          step="0.01"
          required
          value={bill.subtotal}
          onChange={handleChange}
          name="subtotal"
        />
        <br />
        <label>Tax Amount: $</label>
        <input
          type="number"
          id="add-bill-tax_total"
          className="bill_inputs"
          placeholder="0"
          value={bill.tax_total}
          onChange={handleChange}
          name="tax_total"
        />
        <br />
        Tax Rate: {GetTaxRate(bill) * 100}%
        <br />
        <label>Tip (percentage): </label>
        <input
          type="number"
          id="add-bill-tip-rate"
          name="tip_rate"
          className="bill_inputs"
          placeholder="0"
          required
          value={bill.tip_rate}
          onChange={handleChange}
        />
        %
        <br />
        Tip Amount: ${bill.tip_total}
        <br />
        Full Amount: ${GetTotal(bill)}
        <br />
        <label>When: </label>
        <input
          type="date"
          id="add-bill-date"
          name="transaction_date"
          className="bill_inputs"
          placeholder="0"
          required
          value={bill.transaction_date}
          onChange={handleChange}
        />
        {!bill.bill_id ? (
          ""
        ) : (
          <i> Previous Date: {bill.transaction_date.slice(0, 10)}</i>
        )}
        <br />
        <label>Where: </label>
        <input
          type="text"
          id="add-bill-location"
          name="location"
          className="bill_inputs"
          placeholder="Starbucks"
          required
          value={bill.location}
          onChange={handleChange}
        />
        <br />
        <ContactDropDown
          label="Who Paid?"
          id="add-bill-payer"
          name="who_paid"
          className="bill_inputs"
          required
          value={bill.email}
          handleChange={handleChange}
        />
        <br />
        <label>Have they been paid back? </label>
        <input
          type="radio"
          id="add-bill-paid-status"
          name="paid_up"
          className="bill_inputs"
          required
          value={false}
          defaultChecked={bill.paid_up === false}
          onChange={handleChange}
        />{" "}
        <label>No</label>
        <input
          type="radio"
          id="add-bill-paid-status"
          name="paid_up"
          className="bill_inputs"
          required
          value={true}
          defaultChecked={bill.paid_up === true}
          onChange={handleChange}
        />{" "}
        <label>Yes</label>
        <br />
        <label>Notes:</label>
        <textarea
          rows="5"
          type="text"
          id="add-bill-notes"
          name="bill_notes"
          className="bill_inputs"
          value={bill.bill_notes}
          onChange={handleChange}
        />
      </fieldset>
      <button type="submit" className="addbutton">
        {!bill.bill_id ? "Add Bill" : "Save Changes"}
      </button>
      <div>
        {showBillAddedMsg ? (
          <p className="post_success">${prevBillInfo} Bill Added!</p>
        ) : (
          ""
        )}
      </div>
    </form>
  );
};

export default BillForm;
