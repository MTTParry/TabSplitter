import { useState } from "react";

const emptyBill = {
  transaction_date: "",
  subtotal: null,
  tax_rate: null,
  tax_amount: null,
  tip_rate: null,
  tip_total: null,
  who_paid: null,
  paid_up: null,
  notes: "",
  full_total: null,
};

const BillForm = (props) => {
  //An initial student if there is one in props
  const { initialBill = { ...emptyBill } } = props;

  // Initial State
  const [bill, setBill] = useState(initialBill);

  //create functions that handle the event of the user typing into the form
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setBill((bill) => ({ ...bill, [name]: value }));
    //console.log("client side", contact);
  };

  //A function to handle the POST request
  const postNewBill = (newBill) => {
    return fetch("http://localhost:5005/db/bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBill),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("From the bill add ", data);
        // props.addPost(data);
      });
  };

  //A function to handle the PUT request
  const updateBillInfo = async (existingBill) => {
    return fetch(`http://localhost:5005/db/bills/${existingBill.bill_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(existingBill),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("The updated bill info: ", data);
        props.updateContact(data);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bill.bill_id) {
      updateBillInfo(bill);
    } else {
      postNewBill(bill);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>New Bill</h3>
      <fieldset>
        <label>Subtotal: $</label>
        <input
          type="number"
          id="add-bill-subtotal"
          className="bill_inputs"
          placeholder="0"
          required
          value={bill.firstname}
          onChange={handleChange}
          name="bill_subtotal"
        />
        <br />
        <label>Tax Amount: $</label>
        <input
          type="number"
          id="add-bill-tax_amount"
          className="bill_inputs"
          placeholder="0"
          value={bill.tax_total}
          onChange={handleChange}
          name="bill-tax-amount"
        />
        <br />
        <label>Tip (percentage): </label>
        <input
          type="number"
          id="add-bill-tip-rate"
          name="bill-tip-rate"
          className="bill_inputs"
          placeholder="0"
          required
          value={bill.tip_rate}
          onChange={handleChange}
        />
        %
        <br />
        <label>When: </label>
        <input
          type="date"
          id="add-bill-date"
          name="bill-date"
          className="bill_inputs"
          placeholder="0"
          required
          value={bill.transaction_date}
          onChange={handleChange}
        />
        <br />
        <label>Who Paid? </label>
        <input
          type="number"
          id="add-bill-payer"
          name="bill-who-paid"
          className="bill_inputs"
          placeholder="0"
          required
          value={bill.email}
          onChange={handleChange}
        />
        <br />
        <label>Have they been paid back? </label>
        <input
          type="radio"
          id="add-bill-paid-status"
          name="bill-paid-status"
          className="bill_inputs"
          required
          value={bill.paid_up}
          onChange={handleChange}
        /> <label>No</label>
        <input
          type="radio"
          id="add-bill-paid-status"
          name="bill-paid-status"
          className="bill_inputs"
          required
          value={bill.paid_up}
          onChange={handleChange}
        /> <label>Yes</label>
        <br />
      </fieldset>
      <button type="submit">
        {!bill.bill_id ? "Add Bill" : "Save Changes"}
      </button>
    </form>
  );
};

export default BillForm;
