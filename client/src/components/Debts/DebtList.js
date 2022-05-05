import React from "react";
import { useState, useEffect } from "react";
import DebtForm from "./DebtForm";

const emptyDebt = {
  which_bill: null,
  subtotal: null,
  how_much: null,
  who_owes: null,
  debt_paid_up: null,
  notes: "",
};

function DebtList() {
  //This needs an empty array, or the whole thing breaks
  const [debts, setDebts] = useState([]);
  const [editDebtById, setEditDebtById] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5005/db/debts")
      .then((response) => response.json())
      .then((debtsData) => {
        setDebts(debtsData);
      });
  }, []);

  //  const deleteP Contacts
  const deleteDebt = async (debt_id) => {
    try {
      const deleteResponse = await fetch(
        `http://localhost:5005/db/debts/${debt_id}`,
        {
          method: "DELETE",
        }
      );
      if (deleteResponse.status === 200) {
        setDebts(debts.filter((debt) => debt.debt_id !== debt_id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  //PUT stuff
  // grabs the id of the post to be editted
  const editDebt = (debt) => {
    const editById = debt.debt_id;
    console.log(editById);
    setEditDebtById(editById);
  };

  const updateDebt = async (updatedDebtInfo) => {
    setDebts((debts) => {
      const newListDebts = [];
      for (let debt of debts) {
        if (debt.debt_id === updatedDebtInfo.debt_id) {
          newListDebts.push(updatedDebtInfo);
        } else {
          newListDebts.push(debt);
        }
      }
      return newListDebts;
    });

    setEditDebtById(null);
  };

  return (
    <div className="lists">
      <h2>List of Debts</h2>
      <ul className="Instructions">
        This is a list of each debt owed, based on bills that have been paid.
        This includes:
        <li>the subtotal of the debt</li>
        <li>the total owed (with tax + tip)</li>
        <li>who is owed</li>
        <li>who owes</li>
        <li>how to best pay back the person owed.</li>
      </ul>

      {debts.map((debt) => {
        if (debt.debt_id === editDebtById) {
          return <DebtForm initialPost={debt} savePost={updateDebt} />;
        } else {
          return (
            <div className="card" key={debt.debt_id}>
              <h2>
                {debt.first_name} is owed {debt.how_much}, from bill id #
                {debt.bill_id} on {debt.transaction_date}.
              </h2>
              <p>
                How they would like to be paid back:{" "}
                <b>{debt.preferred_payment_method}</b>
              </p>
              <ul className="bill-info">
                <li>
                  Subtotal: <b>{debt.subtotal}</b>
                </li>
                <li>Total debt: ({debt.how_much})</li>
                <li>
                  Has this person been fully paid back?{" "}
                  <b>{debt.debt_paid_up.toString()}</b>
                </li>
                <li>
                  Notes: <b>{debt.debt_notes}</b>
                  <br /> {debt.bill_notes}
                </li>
              </ul>

              <button
                className="editbuttons"
                key="edit_${debt.debt_id}"
                value={debt.debt_id}
                onClick={() => editDebt(debt.debt_id)}
              >
                EDIT Debt
              </button>

              <button
                className="deletebuttons"
                key="delete_${debt.debt_id}"
                value={debt.debt_id}
                onClick={() => deleteDebt(debt.debt_id)}
              >
                DELETE Debt
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

export default DebtList;
