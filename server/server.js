const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const db = require("../server/db/db-connection.js");
const REACT_BUILD_DIR = path.join(__dirname, "..", "client", "build");
const app = express();
app.use(express.static(REACT_BUILD_DIR));

const PORT = process.env.PORT || 5005;
app.use(cors());
app.use(express.json());

//creates an endpoint for the route /api
app.get("/", (req, res) => {
  res.sendFile(path.join(REACT_BUILD_DIR, "index.html"));
});

// GETS
// CONTACT LIST
app.get("/db/contacts", cors(), async (req, res) => {
  try {
    const { rows: contacts } = await db.query(
      "SELECT * FROM contacts ORDER BY contact_id"
    );
    res.send(contacts);
    console.log(contacts);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
});

//simple bills
app.get("/db/bills", cors(), async (req, res) => {
  try {
    const { rows: bills } = await db.query("SELECT * FROM bill_list");
    res.send(bills);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
});

// FULL BILL LIST
// for the get, the bill table is joined with the contacts for display purposes
// this way the list can show "<this person (contact.firstname)> paid <this much(bill_list.full_total)>"
app.get("/db/bills_full", cors(), async (req, res) => {
  try {
    const { rows: bills } = await db.query(
      // get everything from the bill_list table
      "SELECT * FROM bill_list ORDER BY transaction_date;"
    );

    //for each bill
    for (bill of bills) {
      const { rows: debts } = await db.query(
        //get all from debt_list items for each bill
        //debt_list has been joined with contacts, by who_owes, where debt_list bill is THAT bill
        "SELECT * FROM debt_list JOIN contacts ON debt_list.who_owes = contacts.contact_id WHERE debt_list.which_bill = $1;",
        [bill.bill_id]
      );
      bill.debts = debts;

      const { rows: payees } = await db.query(
        //Gets all the contact info for the bill payee
        "SELECT * FROM contacts WHERE contact_id = $1;",
        [bill.who_paid]
      );
      bill.payee = payees[0];
    }

    res.send(bills);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
});

//DEBT LIST
app.get("/db/debts", cors(), async (req, res) => {
  try {
    const { rows: debts } = await db.query(
      "SELECT * FROM debt_list FULL OUTER JOIN contacts ON debt_list.who_paid = contacts.contact_id FULL OUTER JOIN bill_list ON debt_list.which_bill = bill_list.bill_id"
    );
    res.send(debts);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
});

// app.get("/db/debts_full", cors(), async (req, res) => {
//   try {
//     const { rows: debts } = await db.query(
//       // get everything from the bill_list table
//       "SELECT * FROM debt_list ORDER BY creationtimestamp;"
//     );

//     //for each debt
//     for (debt of debts) {
//       const { rows: bill } = await db.query(
//         //get all from debt_list items for each bill
//         //debt_list has been joined with contacts, by who_owes, where debt_list bill is THAT bill
//         "SELECT * FROM bill_list JOIN contacts ON bill_list.who_owes = contacts.contact_id WHERE debt_list.which_bill = $1;",
//         [bill.bill_id]
//       );
//       bill.debts = debts;

//       const { rows: payees } = await db.query(
//         //Gets all the contact info for the bill payee
//         "SELECT * FROM contacts WHERE contact_id = $1;",
//         [bill.who_paid]
//       );
//       bill.payee = payees[0];
//     }

//     res.send(bills);
//   } catch (e) {
//     console.log(e);
//     return res.status(400).json({ e });
//   }
// });


//POSTS
//contacts
app.post("/db/contacts", cors(), async (req, res) => {
  console.log("Start server POST request...");
  try {
    const newContact = {
      first_name: req.body.firstname,
      last_name: req.body.lastname,
      email: req.body.email,
      preferred_payment_method: req.body.preferred_payment_method,
    };
    console.log([newContact]);
    const result = await db.query(
      "INSERT INTO contacts (first_name, last_name, email, preferred_payment_method, creation_TimeStamp) VALUES($1, $2, $3, $4, current_timestamp) RETURNING *",
      [
        newContact.first_name,
        newContact.last_name,
        newContact.email,
        newContact.preferred_payment_method,
      ]
    );
    console.log(result.rows[0]);
    res.json(result.rows[0]);
  } catch (e) {
    console.log(e.message);
  }
});

//bills
app.post("/db/bills", cors(), async (req, res) => {
  const newBill = {
    transaction_date: req.body.transaction_date,
    subtotal: req.body.subtotal,
    tax: req.body.tax,
    tip: req.body.tip,
    who_paid: req.body.who_paid,
    paid_up: req.body.paid_up,
    bill_notes: req.body.bill_notes,
  };
  console.log([newBill]);
  const result = await db.query(
    "INSERT INTO bill_list (transaction_date, subtotal, tax, tip, who_paid, paid_up, bill_notes, creationTimeStamp) VALUES($1, $2, $3, $4, $5, $6, $7, current_timestamp) RETURNING *",
    [
      newBill.transaction_date,
      newBill.subtotal,
      newBill.tax,
      newBill.tip,
      newBill.who_paid,
      newBill.paid_up,
      newBill.bill_notes,
    ]
  );
  console.log(result.rows[0]);
  res.json(result.rows[0]);
});

//debts
app.post("/db/debts", cors(), async (req, res) => {
  const newDebt = {
    which_bill: req.body.which_bill,
    how_much: req.body.how_much,
    who_paid: req.body.who_paid,
    who_owes: req.body.who_owes,
    debt_paid_up: req.body.debt_paid_up,
    debt_notes: req.body.debt_notes,
    subtotal: req.body.subtotal,
  };
  console.log([newDebt]);
  const result = await db.query(
    "INSERT INTO debt_list (which_bill, how_much, who_paid, who_owes, debt_paid_up, debt_notes, subtotal, creationTimeStamp) VALUES($1, $2, $3, $4, $5, $6, $7, current_timestamp) RETURNING *",
    [
      newDebt.which_bill,
      newDebt.how_much,
      newDebt.who_paid,
      newDebt.who_owes,
      newDebt.debt_paid_up,
      newDebt.debt_notes,
      newDebt.subtotal
    ]
  );
  console.log(result.rows[0]);
  res.json(result.rows[0]);
});

// DELETES
// contacts
app.delete("/db/contacts/:contact_id", cors(), async (req, res) => {
  const contactId = req.params.contact_id;
  //console.log(req.params);
  await db.query("DELETE FROM contacts WHERE contact_id=$1", [contactId]);
  res.status(200).end();
});

// bills
app.delete("/db/bills/:bill_id", cors(), async (req, res) => {
  const billId = req.params.bill_id;
  //console.log(req.params);
  await db.query("DELETE FROM bill_list WHERE bill_id=$1", [billId]);
  res.status(200).end();
});

// debts
app.delete("/db/debts/:debt_id", cors(), async (req, res) => {
  const debtId = req.params.debt_id;
  //console.log(req.params);
  await db.query("DELETE FROM debt_list WHERE debt_id=$1", [debtId]);
  res.status(200).end();
});

// Put request - Update request
app.put("/db/contacts/:contact_id", cors(), async (req, res) => {
  const contactId = req.params.contact_id;
  console.log("Put statement", req.params);
  const updateContact = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    preferred_payment_method: req.body.preferred_payment_method,
  };
  console.log("PUT body", req.body);
  console.log("PUT contact id", contactId);
  console.log("Updated contact", updateContact);
  const query = `UPDATE contacts SET first_name=$1, last_name=$2, email=$3, preferred_payment_method=$4 WHERE contact_id = ${contactId} RETURNING *`;
  console.log(query);
  const values = [
    updateContact.first_name,
    updateContact.last_name,
    updateContact.email,
    updateContact.preferred_payment_method,
  ];
  try {
    const updated = await db.query(query, values);
    console.log(updated.rows[0]);
    res.send(updated.rows[0]);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
});

// console.log that your server is up and running
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
