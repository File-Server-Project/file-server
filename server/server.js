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

//imports
// const multer = require('multer');
// const { check, validationResult } = require('express-validator');
// const { timeLog } = require('console');
// const uuid = require('uuid').v4;

// set the view engine to ejs
// app.use(express.static( __dirname + `/public`));
// app.set('views', './public');
// app.set('view engine', 'ejs');
// const urlencodedParser = bodyParser.urlencoded({ extended: false });


// const storage = multer.diskStorage({
//   destination: (req, file, cb) =>{
//     cb(null, './uploads/');
//   },
//   filename: (req, file, cb) => {
//     const { originalname } = file;
//     cb(null, `${uuid()}-${originalname}`);
//   }
// });
// const upload = multer({ storage: storage });


// login page
// app.get('', function(req, res) {
//   res.render('Login');
// });

// app.get('/Register', function(req, res) {
//     res.render('Register');
//   });

//   app.get('/Login', function(req, res) {
//     res.render('Login');
//   });

//   app.get('/FeedPage', function(req, res) {
//     res.render('feedPage');
//   });

//   app.get('/Index', function(req, res) {
//     res.render('index');
//   });

//   app.get('/ForgetPassword', function(req, res) {
//     res.render('ForgetPassword');
//   });

// index page
/*
app.post('/login', function(req, res) {
  res.redirect('/Index');
}); */


// Users Section

// Login
app.post('/login', 
// urlencodedParser, 
// [
//   check('username', 'This username must be 3+ characters long')
//       .exists()
//       .isLength({ min: 3 }),
//   check('email', 'Email is not valid')
//       .isEmail(),
//   check('password', 'Invalid password').isLength({ min: 7 })

// ], 
async (req, res) => {
    const {email, password} = req.body;

    console.log(email, password);

    const query = `SELECT * FROM users WHERE email = "${email}" AND password = "${password}" `;

    await db.all(query, (err, rows) => {
      if(err) return console.error(err.message);

      // if (rows.length === 0){
          // res.json("Invalid user");
      //     console.log("Invalid User");
      // }else{
      //     // res.json(rows);
          console.log(rows);
          res.json(rows);
          // res.render('index');
      // }
  });

});





app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
 });
