// JS script here
const express = require('express');
const app = express();
const cookieparser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fileupload = require('express-fileupload');
const bodyParser = require('body-parser');
const { extname, resolve } = require('path');
require('dotenv').config();
const { transporter, signup, verifyemail, createToken, login } = require('./Auth');
const { loginrequired, mustVerifyEmail } = require('./JWT');
const {Users, Files, Downloads, Emailings} = require('./models/users');
const fs = require('fs');

//imports  
const { check, validationResult } = require('express-validator');


// set the view engine to ejs
app.use(express.static( __dirname + `/public`));
app.use(cookieparser());
app.use(express.json());
app.use(cors());
app.use(fileupload());
app.set('views', './public');
app.set('view engine', 'ejs');
const urlencodedParser = bodyParser.urlencoded({ extended: false });



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

  

  //go to feefpage
  app.get('/FeedPage', async function(req, res) {
    try {
      const items = '';//Search the files table for all records

      if(items) {
        res.render('feedPage', {items: items});
      } else {
        items = [{msg : 'No files avalable'}];
        res.render('feedPage', {items: items});
      };
      
    } catch(err) {
      console.log(err);
    }
  });


//redirecting  to index
  app.get('/Index', loginrequired,  function(req, res) {
    res.render('index');
  });


//render index
  app.get('/index', function(req, res) {
    //let check = process.env.user === process.env.ADMIN;
    res.render('index',);
  });


///when you click login button
app.post('/login', urlencodedParser, [
  check('username', 'This username must be 3+ characters long')
      .exists()
      .isLength({ min: 3 }),
  check('email', 'Email is not valid')
      .isEmail(),
  check('password', 'Invalid password').isLength({ min: 7 })

],/* mustVerifyEmail,*/ login);


//when you click signup button
app.post('/register', urlencodedParser, [
  check('username', 'This username must be 3+ characters long')
      .exists()
      .isLength({ min: 3 }),
  check('email', 'Email is not valid')
      .isEmail(),
  check('password', 'Invalid password').isLength({ min: 7 })
], signup);



//when you click upload button
  app.post('/upload', async (req, res) => {
    try {
      console.log(req.files);
      const title = req.body.title;
      const description = req.body.description;
      const filename = req.files.upload.name;
      const filetype = req.files.upload.mimetype;

      const findfile = await Files.findOne({ title : title });
      if(findfile) {
        console.log('file exists already');
      }

      let newfile = new Files({
          title,
          description,
          filename,
          filetype
        });

      await newfile.save((err, success) => {
          if(err) {
            console.log("Error uploading file: ", err);
            return res.status(400).json({error: err})
           }
          console.log('File saved Successful!!');
        })

        let foldername = __dirname + `/uploads/${title}`;

        if (!fs.existsSync(folderName)) {
          fs.mkdirSync(folderName)
        }

       req.files.upload.mv( foldername+filename, function(err) {
          if(err) {
            res.send(err);
          } else {
            res.send("File Uploaded successfully");
          }
        });
      
    } catch(err) {
      console.log(err);
    }
  });


///email verification
    app.get('/verifyemail', verifyemail);



///when you try to reset password
  app.post('/reset', urlencodedParser, [
    check('username', 'This username must be 3+ characters long')
        .exists()
        .isLength({ min: 3 }),
    check('email', 'Email is not valid')
        .isEmail(),
   check('Newpassword', 'Invalid password').isLength({ min: 7 }),
    check('resetpass', 'Invalid password').isLength({ min: 7 })
  ], async (req, res) => {
   try {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      //return res.status(422).jsonp(errors.array())
      const alert = errors.array();
      res.render('ForgetPassword', {alert});
    }

    const {username, email, Newpassword, resetpass } = req.body;

    const findfile = await Users.findOne({ username : username, email: email });

    if(findfile) {

      if(Newpassword === resetpass) {
        Users.findOneAndUpdate({username: username}, {email: email}, {password: Newpassword}, (err, updatedDoc) => {
          if(err) return console.log(err);
          done(null, updatedDoc);
        });
      } else{
        res.send('New password must be equal to confirm password');
      }

    } else {
      res.send('User with username and email does not exist');
    }

        
   } catch(err) {
     console.log(err)
;   }
      
  });




///when you type a search in homepage
  app.post('/search',  async function(req, res) {
    const searchword = req.body.search;
    const items = await Files.find({ title: { $regex: searchword } });
    if(items.length !== 0) {
      res.render('index', {items} );
    } else {
      items = [{filename : 'No files avalable'}];
        res.render('index', {items: items});
    }
    
  });


///when you click logout
  app.get('/logout', function(req, res) {
    res.cookie('access-token', "", { maxAge : 1 });
    res.redirect('/Login' );
  });



const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
 });
