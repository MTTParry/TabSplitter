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

//GETS
//contact list
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

//contact list
app.get("/db/bills", cors(), async (req, res) => {
  try {
    const { rows: bills } = await db.query("SELECT * FROM bill_list");
    res.send(bills);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
});

//contact list
app.get("/db/debts", cors(), async (req, res) => {
  try {
    const { rows: debts } = await db.query("SELECT * FROM debt_list");
    res.send(debts);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
});

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

// //bills
// app.post("/db/bills", cors(), async (req, res) => {
//   const newBill = {
//     transaction_date: req.body.transaction_date,
//     subtotal: req.body.subtotal,
//     tax: req.body.tax,
//     tip: req.body.tip,
//     who_paid: req.body.who_paid,
//     paid_up: req.body.paid_up,
//     notes: req.body.notes,
//   };
//   console.log([newBill]);
//   const result = await db.query(
//     "INSERT INTO bill_list (transaction_date, subtotal, tax, tip, who_paid, paid_up, notes, creationTimeStamp) VALUES($1, $2, $3, $4, $5, $6, $7, current_timestamp) RETURNING *",
//     [
//       newBill.transaction_date,
//       newBill.subtotal,
//       newBill.tax,
//       newBill.tip,
//       newBill.who_paid,
//       newBill.paid_up,
//       newBill.notes,
//     ]
//   );
//   console.log(result.rows[0]);
//   res.json(result.rows[0]);
// });

// //debts
// app.post("/db/debts", cors(), async (req, res) => {
//   const newDebt = {
//     which_bill: req.body.which_bill,
//     how_much: req.body.how_much,
//     who_paid: req.body.who_paid,
//     who_owes: req.body.who_owes,
//     debt_paid_up: req.body.debt_paid_up,
//     notes: req.body.notes,
//     subtotal: req.body.subtotal,
//   };
//   console.log([newDebt]);
//   const result = await db.query(
//     "INSERT INTO debt_list (which_bill, how_much, who_paid, who_owes, debt_paid_up, notes, subtotal, creationTimeStamp) VALUES($1, $2, $3, $4, $5, $6, $7, current_timestamp) RETURNING *",
//     [
//       newDebt.which_bill,
//       newDebt.how_much,
//       newDebt.who_paid,
//       newDebt.who_owes,
//       newDebt.debt_paid_up,
//       newDebt.notes,
//       newDebt.subtotal,
//     ]
//   );
//   console.log(result.rows[0]);
//   res.json(result.rows[0]);
// });

// delete request
app.delete("/db/contacts/:contact_id", cors(), async (req, res) => {
  const contactId = req.params.contact_id;
  //console.log(req.params);
  await db.query("DELETE FROM contacts WHERE contact_id=$1", [contactId]);
  res.status(200).end();
});

// // // Put request - Update request
// // app.put("/db/contacts/:contact_Id", cors(), async (req, res) => {
// //   const studentId = req.params.studentId;
// //   const updateStudent = {
// //     id: req.body.id,
// //     firstname: req.body.firstname,
// //     lastname: req.body.lastname,
// //   };
// //   //console.log(req.params);
// //   // UPDATE students SET lastname = 'TestMarch' WHERE id = 1;
// //   console.log(studentId);
// //   console.log(updateStudent);
// //   const query = `UPDATE students SET lastname=$1, firstname=$2 WHERE id = ${studentId} RETURNING *`;
// //   console.log(query);
// //   const values = [updateStudent.lastname, updateStudent.firstname];
// //   try {
// //     const updated = await db.query(query, values);
// //     console.log(updated.rows[0]);
// //     res.send(updated.rows[0]);
// //   } catch (e) {
// //     console.log(e);
// //     return res.status(400).json({ e });
// //   }
// // });

// console.log that your server is up and running
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
