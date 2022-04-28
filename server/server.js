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

//forgot Password
app.post('/forgotPassword', async (req, res) => {

  const {email} = req.body;
  console.log(email);

  const query = `SELECT * FROM users WHERE email = "${email}"`;

  await db.all(query, async (err, rows) => {
    if(err) return console.error(err.message);
    console.log(rows.length);
    if (rows.length === 0){
        res.json("Invalid user");
        console.log("Invalid User");
    }else{
                      
        rows.forEach(async row => {
          console.log(row.username);
        

        let transporter = nodemailer.createTransport({
          // https://ethereal.email/
          host: "smtp.ethereal.email",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: 'gardner.littel10@ethereal.email', // generated ethereal user
            pass: 'wuAQHdZaRu7Q7XcBqv', // generated ethereal password
          },
        });
      
        const msg = {
          from: '"The File Server" <info@fileserver.com>', // sender address
          to: `${email}`, // list of receivers
          subject: "Reset Password", // Subject line
          text: `Dear ${row.username}, \nPlease copy and paste the link below into your browser in order to rest your password\nhttps://asdyyu.herokuapp.com/templates/resetpassword.html?email=${email}\nThank you`, // plain text body
          
        };
        // send mail with defined transport object
        let info = await transporter.sendMail(msg);
      
        // console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  
        console.log('Email Sent');
        res.json('Email sent');
      
      });
    }
  });
});

  // Files Section

  // File Upload
app.post('/fileUpload',
  async (req, res) => {
    console.log("hello");
    // res.redirect('/Index');
    const {title, description} = req.body;
    console.log(title, description);
    console.log(req.files);
    if (req.files){
    console.log(req.files);
    
    var file = req.files.file;
    var filename = file.name;
    file.mv("./uploadedFiles/"+filename, async (err) => {
        if (err){
            console.log(err);
            res.send("error occured");
        }
        else{
          const query = 'INSERT INTO files (title, description, fileName) VALUES (?, ?,?)';
  
          await db.run(
              query,
              [title, description, filename],
              (err) => {
                  if(err) return console.error(err.message);
                  console.log("File added successfully");
                  // res.json("User added successfully");
                  res.json("File added successfully");
                  //  res.redirect('/Login');
              }
          );
            // res.send("Done!");
        }
    });
  }
});
  
//Get All files

app.get('/allFiles', async (req, res) => {
  const query = `SELECT * FROM files`;

  await db.all(query, (err, rows) => {
    if(err) return console.error(err.message);

    res.json(rows);

  });
});

// file Search
app.post('/fileSearch',  async function(req, res) {
  const {search} = req.body;
  console.log(search);
  const query = `SELECT * FROM files WHERE title LIKE "%${search}%" AND description LIKE "%${search}%" `;

  await db.all(query, (err, rows) => {
    if(err) return console.error(err.message);

    console.log(rows);
    res.json(rows);
  });
  

});


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
 });
