const { Pool } = require("pg");
let DATABASE_URL;
if (process.env.NODE_ENV === "production") {
  DATABASE_URL = process.env.DATABASE_URL;
  console.log("HELLO");
  console.log(process.env.DATABASE_URL);
} else {
  DATABASE_URL = process.env.LOCAL_DATABASE_URL;
}
const db = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.DATABASE_SSL != "false" && {
    rejectUnauthorized: false,
  },
});

module.exports = db;
