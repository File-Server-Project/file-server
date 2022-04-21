// JS script here
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { extname, resolve } = require('path');

const nodemailer = require("nodemailer");

app.use(express.json())
//  Import dbConnection
const db = require('./dbConnection');

//imports
const multer = require('multer');
const { check, validationResult } = require('express-validator');
const uuid = require('uuid').v4;

// set the view engine to ejs
app.use(express.static( __dirname + `/public`));
app.set('views', './public');
app.set('view engine', 'ejs');
const urlencodedParser = bodyParser.urlencoded({ extended: false });


const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, `${uuid()}-${originalname}`);
  }
});
const upload = multer({ storage: storage });


// login page
app.get('', function(req, res) {
  res.render('Login');
});

app.get('/Register', function(req, res) {
    res.render('Register');
  });

  app.get('/Login', function(req, res) {
    res.render('Login');
  });

  app.get('/FeedPage', function(req, res) {
    res.render('feedPage');
  });

  app.get('/Index', function(req, res) {
    res.render('index');
  });

// index page
/*
app.post('/login', function(req, res) {
  res.redirect('/Index');
}); */

app.post('/login', urlencodedParser, [
  check('username', 'This username must be 3+ characters long')
      .exists()
      .isLength({ min: 3 }),
  check('email', 'Email is not valid')
      .isEmail(),
  check('password', 'Invalid password').isLength({ min: 7 })

], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      //return res.status(422).jsonp(errors.array())
      const alert = errors.array();

      res.render('Login', {alert});
    }
    //res.redirect('/Register');
    const {username,email, password} = req.body;
    console.log(username, email, password);

    const query = `SELECT * FROM users WHERE email LIKE "%${email}%" AND password LIKE "%${password}%" `;

    await db.all(query, (err, rows) => {
      if(err) return console.error(err.message);
      console.log(rows.length);
      if (rows.length === 0){
          // res.json("Invalid user");
          console.log("Invalid User");
      }else{
          // res.json(rows);
          console.log(rows);
          res.render('index');
      }
  });

});


app.post('/register', urlencodedParser, [
  check('username', 'This username must be 3+ characters long')
      .exists()
      .isLength({ min: 3 }),
  check('email', 'Email is not valid')
      .isEmail(),
  check('password', 'Invalid password').isLength({ min: 7 })

], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      //return res.status(422).jsonp(errors.array())
      const alert = errors.array();

      res.render('Register', {alert});
    }
    //res.redirect('/Register');git remote -v
    
    const {username, email, password} = req.body;
    console.log(username);
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
   
    await db.run(
        query,
        [username, email, password],
        (err) => {
            if(err) return console.error(err.message);
            console.log("User added successfully");
            // res.json("User added successfully");
            res.redirect('/Login');
        }
    );

    // res.redirect('/Login');
  });

  app.post('/upload', upload.single('upload'), async (req, res) => {
     // res.redirect('/Index');
     //console.log(req);
     //console.log(req.body);
     //console.log(req.file);
     const {title, description} = req.body;

     const query = 'INSERT INTO files (title, description) VALUES (?, ?)';
   
     await db.run(
         query,
         [title, description],
         (err) => {
             if(err) return console.error(err.message);
             console.log("File added successfully");
             // res.json("User added successfully");
             res.json("File added successfully");
            //  res.redirect('/Login');
         }
     );

     res.json(req.body);
    });




  app.post('/password', urlencodedParser, [
    check('username', 'This username must be 3+ characters long')
        .exists()
        .isLength({ min: 3 }),
    check('email', 'Email is not valid')
        .isEmail(),
  
  ], async (req, res) => {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        //return res.status(422).jsonp(errors.array())
        const alert = errors.array();
        
        const {email} = req.body;

        const query = `SELECT * FROM users WHERE email LIKE "%${email}%"`;

        await db.all(query, async (err, rows) => {
          if(err) return console.error(err.message);
          console.log(rows.length);
          if (rows.length === 0){
              res.json("Invalid user");
              console.log("Invalid User");
          }else{
              // res.json(rows);
              // console.log(rows);

              let transporter = nodemailer.createTransport({
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
                text: "Click this link to reset your password", // plain text body
                html: '<p>Highlight the link below and click "go to to http://localhost:8080/ResetPassword" to reset your password</p> </br> <a>http://localhost:8080/ResetPassword</a>', // html body
              };
              // send mail with defined transport object
              let info = await transporter.sendMail(msg);
            
              console.log("Message sent: %s", info.messageId);
              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            
              // Preview only available when sending through an Ethereal account
              console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        
              console.log('Email Sent');
              res.json('Email sent');
              // res.render('index');
          }
      });

        // res.render('ForgetPassword', {alert});
      }
  });

  app.post('/reset', function(req, res) {
    res.render('index');
  });

  app.get('/search', async function(req, res) {
    const {search} = req.body;
    console.log(search);
    const query = `SELECT * FROM files WHERE title LIKE "%${search}%" AND description LIKE "%${search}%" `;

    await db.all(query, (err, rows) => {
      if(err) return console.error(err.message);
      console.log(rows.length);
      if (rows.length === 0){
          res.json("Invalid user");
          console.log("No such file");
      }else{
          res.json(rows);
          console.log(rows);

      }
  });
    // res.render('index', {items} );

  });

  app.post("/download", async (req, res) => {
    console.log(req.body);

    const {downloadFile} = req.body;

    const query = `INSERT INTO downloads (downloadFile) VALUES (?)`;

    await db.run(
      query,
      [downloadFile],
      (err) => {
          if(err) return console.error(err.message);
          console.log("Download added successfully");
          // res.json("User added successfully");
          res.json('Download added successfully');
      }
  );
    // res.json(downloadFile);
  });



app.listen(8080, () => {
    console.log('Server is listening on port 8080')
 });
