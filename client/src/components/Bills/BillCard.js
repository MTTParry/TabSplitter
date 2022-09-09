import React from "react"

const BillCard = ({ bill, editBill, deleteBill }) => {
  return (
    <div className="card" data-testid={"bill-card-"+bill.bill_id}>
      <h2>Bill ID #{bill.bill_id}</h2>
      <p>
        On {bill.transaction_date.slice(0, 10)}, {bill.payee.first_name}{" "}
        {bill.payee.last_name} paid a bill of <b>${bill.full_total}</b> at{" "}
        <b>{bill.location}</b>.
      </p>
      <ul className="bill-info">
        <li>
          Subtotal: <b>{bill.subtotal}</b>
        </li>
        <li>
          Tax Amount ({bill.tax_rate * 100}%): {bill.tax_total}
        </li>
        <li>
          Tip Amount ({bill.tip_rate}%): <b>{bill.tip_total}</b>
        </li>
        <li>
          Total: <b>{bill.full_total}</b>
        </li>
        <li>
          Has this person been fully paid back? <b>{bill.paid_up.toString()}</b>
        </li>
        <li>
          Notes: <b>{bill.bill_notes}</b>
        </li>
      </ul>

      <button
        className="editbuttons"
        key={`edit_${bill.bill_id}`}
        value={bill.bill_id}
        onClick={() => editBill(bill.bill_id)}
      >
        EDIT bill
      </button>

      <button
        className="deletebuttons"
        key={`delete_${bill.bill_id}`}
        value={bill.bill_id}
        onClick={() => deleteBill(bill.bill_id)}
      >
        DELETE bill
      </button>
      <div className="note">CAREFUL: Delete cannot be undone.</div>
    </div>
  );
};

export default BillCard;
