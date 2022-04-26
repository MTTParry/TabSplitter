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
app.get("/api/contacts", cors(), async (req, res) => {
  try {
    const { rows: contacts } = await db.query("SELECT * FROM contacts");
    res.send(contacts);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
});

//contact list
app.get("/api/bills", cors(), async (req, res) => {
  try {
    const { rows: bills } = await db.query("SELECT * FROM bill_list");
    res.send(bills);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
});

//contact list
app.get("/api/debts", cors(), async (req, res) => {
  try {
    const { rows: debts } = await db.query("SELECT * FROM debt_list");
    res.send(debts);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
});

//create the POST request
app.post("/api/students", cors(), async (req, res) => {
  const newUser = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };
  console.log([newUser.firstname, newUser.lastname]);
  const result = await db.query(
    "INSERT INTO students(firstname, lastname) VALUES($1, $2) RETURNING *",
    [newUser.firstname, newUser.lastname]
  );
  console.log(result.rows[0]);
  res.json(result.rows[0]);
});

// delete request
app.delete("/api/students/:studentId", cors(), async (req, res) => {
  const studentId = req.params.studentId;
  //console.log(req.params);
  await db.query("DELETE FROM students WHERE id=$1", [studentId]);
  res.status(200).end();
});

// Put request - Update request
app.put("/api/students/:studentId", cors(), async (req, res) => {
  const studentId = req.params.studentId;
  const updateStudent = {
    id: req.body.id,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };
  //console.log(req.params);
  // UPDATE students SET lastname = 'TestMarch' WHERE id = 1;
  console.log(studentId);
  console.log(updateStudent);
  const query = `UPDATE students SET lastname=$1, firstname=$2 WHERE id = ${studentId} RETURNING *`;
  console.log(query);
  const values = [updateStudent.lastname, updateStudent.firstname];
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
