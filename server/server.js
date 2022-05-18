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

//API stuff

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require("@sendgrid/mail");

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
    const { rows: bills } = await db.query(
      "SELECT * FROM bill_list ORDER BY bill_id"
    );
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
      "SELECT * FROM debt_list JOIN contacts ON debt_list.who_owes = contacts.contact_id JOIN bill_list ON debt_list.which_bill = bill_list.bill_id ORDER BY debt_id"
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
      first_name: req.body.first_name,
      last_name: req.body.last_name,
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
    tax_rate: req.body.tax_rate,
    tax_total: req.body.tax_total,
    tip_rate: req.body.tip_rate,
    tip_total: req.body.tip_total,
    who_paid: req.body.who_paid,
    paid_up: req.body.paid_up,
    bill_notes: req.body.bill_notes,
    full_total: req.body.full_total,
    location: req.body.location,
  };
  console.log([newBill]);
  const result = await db.query(
    "INSERT INTO bill_list (transaction_date, subtotal, tax_rate, tax_total, tip_rate, tip_total, who_paid, paid_up, bill_notes, full_total, location, creationTimeStamp) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,current_timestamp) RETURNING *",
    [
      newBill.transaction_date,
      newBill.subtotal,
      newBill.tax_rate,
      newBill.tax_total,
      newBill.tip_rate,
      newBill.tip_total,
      newBill.who_paid,
      newBill.paid_up,
      newBill.bill_notes,
      newBill.full_total,
      newBill.location,
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
    who_owes: req.body.who_owes,
    debt_paid_up: req.body.debt_paid_up,
    debt_notes: req.body.debt_notes,
    subtotal: req.body.subtotal,
  };
  console.log([newDebt]);
  const result = await db.query(
    "INSERT INTO debt_list (which_bill, how_much, who_owes, debt_paid_up, debt_notes, subtotal, creationTimeStamp) VALUES($1, $2, $3, $4, $5, $6, current_timestamp) RETURNING *",
    [
      newDebt.which_bill,
      newDebt.how_much,
      newDebt.who_owes,
      newDebt.debt_paid_up,
      newDebt.debt_notes,
      newDebt.subtotal,
    ]
  );
  // console.log("results blah blah", result.rows[0].debt_id);
  // const debtInfo = result.rows[0];
  //query who_owes to get "to"
  const emailTo = await db.query("SELECT * FROM contacts WHERE contact_id=$1", [
    newDebt.who_owes,
  ]);
  // console.log("Debtor", emailTo.rows[0]);
  const billInfo = await db.query("SELECT * FROM bill_list WHERE bill_id=$1", [
    newDebt.which_bill,
  ]);
  console.log("Bill info", billInfo.rows[0]);
  const debtFrom = await db.query(
    "SELECT * FROM contacts WHERE contact_id=$1",
    [billInfo.rows[0].who_paid]
  );
  console.log("Who is owed", debtFrom);
  //consider moving line 222 to line 19 -- not sure what line that was :[
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: `${emailTo.rows[0].email}`, // Change to your recipient
    from: "col.snake.butler@gmail.com", // Verified sender email
    subject: "You have a new debt to pay",
    text: `Hello ${emailTo.rows[0].first_name} ${emailTo.rows[0].last_name}, You have a new debt to pay! You owe ${debtFrom.rows[0].first_name} ${debtFrom.rows[0].last_name} $${newDebt.how_much}. ${debtFrom.rows[0].first_name} prefers to be paid ${debtFrom.rows[0].preferred_payment_method}. Feel free to contact ${debtFrom.rows[0].first_name} at ${debtFrom.rows[0].email}. Debts Notes: ${newDebt.debt_notes} Bill Notes: ${billInfo.rows[0].bill_notes} -TabSplitter`,

    html: `Hello ${emailTo.rows[0].first_name} ${emailTo.rows[0].last_name}, <br/>You have a new debt to pay! <br/> You owe ${debtFrom.rows[0].first_name} ${debtFrom.rows[0].last_name} <b>$${newDebt.how_much}</b>. ${debtFrom.rows[0].first_name} prefers to be paid via <b>${debtFrom.rows[0].preferred_payment_method}</b>. <br/>Feel free to contact ${debtFrom.rows[0].first_name} at ${debtFrom.rows[0].email}.<br/> Debts Notes: ${newDebt.debt_notes}<br/>Bill Notes: ${billInfo.rows[0].bill_notes}<br/><br/>-TabSplitter`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error("API error:", error);
    });

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
//contacts
app.put("/db/contacts/:contact_id", cors(), async (req, res) => {
  const contactId = req.params.contact_id;
  console.log("Contacts Put statement", req.params);
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

//bills
app.put("/db/bills/:bill_id", cors(), async (req, res) => {
  const billId = req.params.bill_id;
  console.log("Bill Put statement", req.params);
  const updateBill = {
    transaction_date: req.body.transaction_date,
    subtotal: req.body.subtotal,
    tax_rate: req.body.tax_rate,
    tax_total: req.body.tax_total,
    tip_rate: req.body.tip_rate,
    tip_total: req.body.tip_total,
    who_paid: req.body.who_paid,
    paid_up: req.body.paid_up,
    bill_notes: req.body.bill_notes,
    full_total: req.body.full_total,
    location: req.body.location,
  };
  console.log("Bill PUT body", req.body);
  console.log("PUT bill id", billId);
  console.log("Updated Bill", updateBill);
  const query = `UPDATE bill_list SET transaction_date=$1, subtotal=$2, tax_rate=$3, tax_total=$4, tip_rate=$5, tip_total=$6, who_paid=$7, paid_up=$8, bill_notes=$9, full_total=$10, location=$11 WHERE bill_id = ${billId} RETURNING *`;
  console.log(query);
  const values = [
    updateBill.transaction_date,
    updateBill.subtotal,
    updateBill.tax_rate,
    updateBill.tax_total,
    updateBill.tip_rate,
    updateBill.tip_total,
    updateBill.who_paid,
    updateBill.paid_up,
    updateBill.bill_notes,
    updateBill.full_total,
    updateBill.location,
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

//debts
app.put("/db/debts/:debt_id", cors(), async (req, res) => {
  const debtId = req.params.debt_id;
  console.log("Debt Put statment", req.params);
  const updateDebt = {
    which_bill: req.body.which_bill,
    how_much: req.body.how_much,
    who_owes: req.body.who_owes,
    debt_paid_up: req.body.debt_paid_up,
    debt_notes: req.body.debt_notes,
    subtotal: req.body.subtotal,
  };
  console.log("PUT body", req.body);
  console.log("PUT debt id", debtId);
  console.log("Updated debt", updateDebt);
  const query = `UPDATE debt_list SET which_bill=$1, how_much=$2, who_owes=$3, debt_paid_up=$4, debt_notes=$5, subtotal=$6 WHERE debt_id = ${debtId} RETURNING *`;
  console.log(query);
  const values = [
    updateDebt.which_bill,
    updateDebt.how_much,
    updateDebt.who_owes,
    updateDebt.debt_paid_up,
    updateDebt.debt_notes,
    updateDebt.subtotal,
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

//creates an endpoint for the route /api
app.get("*", (req, res) => {
  res.sendFile(path.join(REACT_BUILD_DIR, "index.html"));
});

// console.log that your server is up and running
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
