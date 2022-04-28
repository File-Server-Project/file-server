// JS script here
const express = require('express');
const zip = require('express-zip');
const app = express();

// const bodyParser = require('body-parser');
// const { extname, resolve } = require('path');

const uploadLib = require('express-fileupload');

const port = process.env.PORT || 8080;

const nodemailer = require("nodemailer");

const cors = require("cors");
app.use(
  cors({
    origin: "*"

  })
)
//  Import dbConnection
const db = require('./dbConnection');

app.use(uploadLib());
app.use(express.json());  // accept data in json format
app.use(express.urlencoded({ extended: true})); // decode data from the HTML form

// Users Section

// Login
app.post('/login', 

async (req, res) => {
    const {email, password} = req.body;

    console.log(email, password);

    const query = `SELECT * FROM users WHERE email = "${email}" AND password = "${password}" `;

    await db.all(query, (err, rows) => {
      if(err) return console.error(err.message);
          console.log(rows);
          res.json(rows);

  });

});


// Sign UP
app.post('/signUp', async (req, res) => {
    const {username, email, password} = req.body;
    console.log(username, email, password);
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
   
    await db.run(
        query,
        [username, email, password],
        async (err) => {
            if(err) return console.error(err.message);

            console.log("User added successfully");
            res.json("User added successfully");
            
        }
    );


  });

  


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
 });
