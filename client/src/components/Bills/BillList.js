import React from "react";
import { useState, useEffect } from "react";
import BillForm from "./BillForm";
import BillCard from "./BillCard";

function BillList() {
  //This needs an empty array, or the whole thing breaks
  const [bills, setBills] = useState([]);
  const [billIdToEdit, setBillIdToEdit] = useState(null);

  useEffect(() => {
    fetch("/db/bills_full")
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
      if (deleteResponse.ok) {
        setBills(bills.filter((bill) => bill.bill_id !== bill_id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  //PUT stuff
  // grabs the id of the post to be editted
  const editBill = (bill_id) => {
    // console.log("Bill ID", bill_id);
    setBillIdToEdit(bill_id);
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
    setBillIdToEdit(null);
  };

  return (
    <div className="lists" data-testid="bill_list">
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
        if (bill.bill_id === billIdToEdit) {
          return (
            <BillForm
              initialBill={bill}
              onSave={updateBill}
              key={bill.bill_id}
            />
          );
        } else {
          return (<BillCard key={bill.bill_id} bill={bill} editBill={editBill} deleteBill={deleteBill} />);
        }
      })}
    </div>
  );
}

export default BillList;
