const express = require("express");
const { pool } = require("../db-config");
const nodemailer = require("nodemailer");

const imsCrud = express.Router();

function sendRegistrationEmail(user) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "testingapps10082001@gmail.com",
      pass: "ckqk ximu oogm rmci",
    },
  });

  const mailOptions = {
    from: "testingapps10082001@gmail.com",
    to: `${user[4]}`,
    subject: "Welcome to Our Website",
    text: `Hello ${user[0]},\nThank you for registering on our website!
      Your username is ${user[2]} and your password is ${user[3]}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: " + error.stack);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

imsCrud.post("/signup", (req, res) => {
  const { fname, lname, emailId, mobileNo } = req.body;

  function generateRandomUsername(length) {
    const characters = "0123456789";
    let username = `${fname}`;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      username += characters[randomIndex];
    }

    return username;
  }

  function generateRandomPassword(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }

    return password;
  }

  const values = [
    fname,
    lname,
    generateRandomUsername(4),
    generateRandomPassword(10),
    emailId,
    mobileNo,
  ];

  const insertQuery = `INSERT INTO registered_users_table (fname, lname, username, pass, emailId, mobileNo) VALUES (?, ?, ?, ?, ?, ?)`;

  pool.query(insertQuery, values, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      res.send(values);
      sendRegistrationEmail(values);
    }
  });
});

imsCrud.post("/login", (req, res) => {
  const { username, pass } = req.body;

  // const query = `SELECT username from registered_users_table WHERE EXISTS (SELECT username FROM registered_users_table WHERE registered_users_table.username = '${username}' AND registered_users_table.pass = '${pass}')`;

  // const insertQuery = `SELECT EXISTS(SELECT username FROM registered_users_table WHERE username = '${username}' AND pass = '${pass}')`;

  const query = `SELECT * FROM registered_users_table WHERE username = '${username}'`;
  pool.query(query, (error, result) => {
    const user = result[0];
    if (error) {
      res.send(error);
    } else if (result.length === 0) {
      res.send("User not found");
    } else if (user.pass !== pass) {
      res.send("Incorrect password");
    } else {
      res.send(result);
    }
  });
});

imsCrud.get("/user", (req, res) => {
  const { username } = req.query;

  const query = `SELECT * FROM registered_users_table WHERE username = '${username}'`;
  pool.query(query, (error, result) => {
    if (error) {
      res.send(error);
    } else {
      res.send(result);
    }
  });
});

imsCrud.get("/javascript", (req, res) => {
  const query = `SELECT * FROM javascript_questions`;
  pool.query(query, (error, result) => {
    if (error) {
      res.send(error);
    } else {
      res.send(result);
    }
  });
});

imsCrud.get("/react", (req, res) => {
  const query = `SELECT * FROM react_questions`;
  pool.query(query, (error, result) => {
    if (error) {
      res.send(error);
    } else {
      res.send(result);
    }
  });
});

imsCrud.get("/html", (req, res) => {
  const query = `SELECT * FROM HTML_questions`;
  pool.query(query, (error, result) => {
    if (error) {
      res.send(error);
    } else {
      res.send(result);
    }
  });
});

imsCrud.get("/css", (req, res) => {
  const query = `SELECT * FROM CSS_questions`;
  pool.query(query, (error, result) => {
    if (error) {
      res.send(error);
    } else {
      res.send(result);
    }
  });
});

imsCrud.post("/postpoints", (req, res) => {
  const { user_id, js_point, react_point, html_point, css_point } = req.body;

  const values = [user_id, js_point, react_point, html_point, css_point];

  const query = `INSERT INTO user_points (user_id, js_point, react_point, html_point, css_point) VALUES (?, ?, ?, ?, ?)`;

  pool.query(query, values, (error, result) => {
    if (error) {
      res.send(error);
    } else {
      res.send(result);
    }
  });
});

imsCrud.get("/userpoint", (req, res) => {
  const { username } = req.query;

  const query = `SELECT * FROM user_points WHERE user_id = '${username}'`;
  pool.query(query, (error, result) => {
    if (error) {
      res.send(error);
    } else {
      res.send(result);
    }
  });
});

imsCrud.put("/updatepoint", (req, res) => {
  const { username, test, point } = req.body;

  console.log(req.body);

  const query = `UPDATE user_points SET ${test} = ${point} WHERE user_id = '${username}'`;
  pool.query(query, (error, result) => {
    if (error) {
      res.send(error);
    } else {
      res.send(result);
    }
  });
});

module.exports = imsCrud;
