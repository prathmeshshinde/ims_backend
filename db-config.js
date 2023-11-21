const mysql = require("mysql2");
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((error) => {
  if (error) throw error;
  else console.log("Connected");
});

module.exports = { pool };
