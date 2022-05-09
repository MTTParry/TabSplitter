import React from "react";
import { useState, useEffect } from "react";
import BillForm from "./BillForm";

const emptyBill = {
  transaction_date: "",
  subtotal: null,
  tax_rate: null,
  tax_amount: null,
  tip_rate: null,
  tip_total: null,
  who_paid: null,
  paid_up: null,
  bill_notes: "",
  full_total: null,
};

function BillList() {
  //This needs an empty array, or the whole thing breaks
  const [bills, setBills] = useState([]);
  const [editBillById, setEditBillById] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5005/db/bills")
      .then((response) => response.json())
      .then((billData) => {
        setBills(billData);
      });
  }, []);

  //  const deleteP Contacts
  const deleteBill = async (bill_id) => {
    try {
      const deleteResponse = await fetch(
        `http://localhost:5005/db/bills/${bill_id}`,
        {
          method: "DELETE",
        }
      );
      if (deleteResponse.status === 200) {
        setBills(bills.filter((bill) => bill.bill_id !== bill_id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  //PUT stuff
  // grabs the id of the post to be editted
  const editBill = (billId) => {
    console.log(billId);
    setEditBillById(billId);
  };

  const updateBill = async (updatedBillInfo) => {
    setBills((bills) => {
      const newListBills = [];
      for (let bill of bills) {
        if (bill.bill_id === updatedBillInfo.bill_id) {
          newListBills.push(updatedBillInfo);
        } else {
          newListBills.push(bill);
        }
      }
      return newListBills;
    });

    setEditBillById(null);
  };

  return (
    <div className="lists">
      <h2> Bill List </h2>
      <ul className="Instructions">
        This is a list of each time a person covered the bill. This includes:
        <li>the subtotal</li>
        <li>tax total</li>
        <li>the tip (percentage)</li>
        <li>when the transaction happened</li>
        <li>who paid for it</li>
        <li>have they been paid back?</li>
      </ul>

      {bills.map((bill) => {
        if (bill.bill_id === editBillById) {
          return <BillForm initialPost={bill} savePost={updateBill} />;
        } else {
          return (
            <div className="card" key={bill.bill_id}>
              <h2>Bill ID #{bill.bill_id}</h2>
              <p>
                On {bill.transaction_date}, {bill.first_name} {bill.last_name}{" "}
                paid a bill of ${bill.full_total}.
              </p>
              <ul className="bill-info">
                <li>
                  Subtotal: <b>{bill.subtotal}</b>
                </li>
                <li>
                  Tax Amount ({bill.tax_rate * 100}%): {bill.tax_total}
                </li>
                <li>
                  Tip Amount ({bill.tip_rate * 100}%): <b>{bill.tip_total}</b>
                </li>
                <li>
                  Total: <b>{bill.full_total}</b>
                </li>
                <li>
                  Has this person been fully paid back? <b>{bill.paid_up}</b>
                </li>
                <li>
                  Notes: <b>{bill.bill_notes}</b>
                </li>
              </ul>

              <button
                className="editbuttons"
                key="edit_${bill.bill_id}"
                value={bill.bill_id}
                onClick={() => editBill(bill.bill_id)}
              >
                EDIT bill
              </button>

              <button
                className="deletebuttons"
                key="delete_${bill.bill_id}"
                value={bill.bill_id}
                onClick={() => deleteBill(bill.bill_id)}
              >
                DELETE bill
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

export default BillList;
