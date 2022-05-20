const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const { auth } = require("express-openid-connect");
const db = require("../server/db/db-connection.js");
const REACT_BUILD_DIR = path.join(__dirname, "..", "client", "build");
const app = express();

//auth0
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASEURL,
  clientID: process.env.CLIENTID,
  issuerBaseURL: process.env.ISSUER,
};

const PORT = process.env.PORT || 5005;
app.use(cors());
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
app.use(express.json());

// WARNING: This was not on heroku1 branch, may be an error
app.use(express.static(REACT_BUILD_DIR));

//auth0
app.get("/api/me", (req, res) => {
  console.log(req.oidc.isAuthenticated());
  if (req.oidc.isAuthenticated()) {
    console.log(req.oidc.user);
    res.json(req.oidc.user);
  } else {
    res.status(401).json({ error: "Error in the auth0" });
  }
});

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

//simple bills
app.get("/db/bill/:bill_id", cors(), async (req, res) => {
  const bill_id = req.params.bill_id;
  try {
    const { rows: bills } = await db.query(
      "SELECT * FROM bill_list WHERE bill_id=$1",
      [bill_id]
    );
    res.send(bills[0]);
  } catch (e) {
    console.log(e);
    return res.status(404).json({ e });
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

    // await ALL of the async functions in the .map
    const fullBills = await Promise.all(
      bills.map(async (bill) => getFullBill(bill))
    );

    res.send(fullBills);
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

  //Debtor information
  //formerly, "emailTo"
  const debtorQueryResults = await db.query(
    "SELECT * FROM contacts WHERE contact_id=$1",
    [newDebt.who_owes]
  );
  const debtor = debtorQueryResults.rows[0];
  if (!debtor) {
    res.status(404).end();
  }
  //info from the associated bill
  const billQueryResults = await db.query(
    "SELECT * FROM bill_list WHERE bill_id=$1",
    [newDebt.which_bill]
  );
  const billInfo = billQueryResults.rows[0];
  if (!billInfo) {
    res.status(404).end();
  }

  // Who paid that bill, the 'payee'
  //formerly debtFrom
  const payeeQueryResults = await db.query(
    "SELECT * FROM contacts WHERE contact_id=$1",
    [billInfo.who_paid]
  );
  const payeeInfo = payeeQueryResults.rows[0];
  if (!payeeInfo) {
    res.status(404).end();
  }
  //consider moving line 222 to line 19
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: `${debtor.email}`, // Change to your recipient
    from: "replace_this_email@email.com", // Verified sender email
    subject: "You have a new debt to pay",
    text: `Hello ${debtor.first_name} ${debtor.last_name}, You have a new debt to pay! You owe ${payeeInfo.first_name} ${payeeInfo.last_name} $${newDebt.how_much}. ${payeeInfo.first_name} prefers to be paid ${payeeInfo.preferred_payment_method}. Feel free to contact ${payeeInfo.first_name} at ${payeeInfo.email}. Debts Notes: ${newDebt.debt_notes} Bill Notes: ${billInfo.bill_notes} -TabSplitter`,

    html: `Hello ${debtor.first_name} ${debtor.last_name}, <br/>You have a new debt to pay! <br/> You owe ${payeeInfo.first_name} ${payeeInfo.last_name} <b>$${newDebt.how_much}</b>. ${payeeInfo.first_name} prefers to be paid via <b>${payeeInfo.preferred_payment_method}</b>. <br/>Feel free to contact ${payeeInfo.first_name} at ${payeeInfo.email}.<br/> Debts Notes: ${newDebt.debt_notes}<br/>Bill Notes: ${billInfo.bill_notes}<br/><br/>-TabSplitter`,
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
    const { rows: updated } = await db.query(query, values);
    const fullUpdatedBill = await getFullBill(updated[0]);
    console.log(updated[0], fullUpdatedBill);
    res.send(fullUpdatedBill);
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
    const results = await db.query(query, values);
    const { rows: joinedDebts } = await db.query(
      "SELECT * FROM debt_list JOIN contacts ON debt_list.who_owes = contacts.contact_id JOIN bill_list ON debt_list.which_bill = bill_list.bill_id WHERE debt_id = $1",
      [debtId]
    );
    const joinedDebt = joinedDebts[0];
    console.logjoinedDebt;
    res.send(joinedDebt);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
});

//creates an endpoint for the route /api
//If this is higher up then none of the requests work
app.get("*", (req, res) => {
  // console.log(req.oidc.isAuthenticated());
  res.sendFile(path.join(REACT_BUILD_DIR, "index.html"));
});

// console.log that your server is up and running
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// ==========
// Helper Functions

/// Takes as input a bill object, populates with debts and payee
const getFullBill = async (input) => {
  let bill = { ...input };

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

  return bill;
};
