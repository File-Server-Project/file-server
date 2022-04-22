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
const { transporter, signup, verifyemail, createToken, login, forgetpassword, reset, fileUpload, fileSearch, feedPage } = require('./Auth');
const { loginrequired, mustVerifyEmail } = require('./JWT');
//const {Users, Files, Downloads, Emailings} = require('./models/users');
const fs = require('fs');
const path = require('path');
const session = require('express-session');



//imports  
const { check, validationResult } = require('express-validator');
const urlencodedParser = bodyParser.urlencoded({ extended: false });



// set the view engine to ejs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieparser());
app.use(express.static( path.join(__dirname, '/public')));

app.use(session({
  secret: '123456cat',
  resave: false,
  saveuninitialized: true,
  cookie: { maxAge: 60000}
}));

app.use(cors());
app.use(fileupload());
app.set('views', './public');
app.set('view engine', 'ejs');




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
  app.get('/FeedPage', feedPage);


//redirecting  to index
  app.get('/Index', /*loginrequired,*/  function(req, res) {
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
  app.post('/fileUpload',  urlencodedParser,  fileUpload );


///email verification
    app.get('/verifyemail', verifyemail);





    ///Forget Password
    app.post('/forgetPassword', urlencodedParser, [
      check('email', 'Email is not valid')
          .isEmail(),
     check('newPassword', 'Invalid password').isLength({ min: 7 }),
      check('confirmPassword', 'Invalid password').isLength({ min: 7 })
    ], forgetpassword);



///when you try to reset password
  app.post('/resetPassword', urlencodedParser, [
    check('email', 'Email is not valid')
        .isEmail(),
   check('newPassword', 'Invalid password').isLength({ min: 7 }),
    check('confirmPassword', 'Invalid password').isLength({ min: 7 })
  ], reset );




///when you type a search in homepage
  app.post('/fileSearch', fileSearch);


///when you click logout
  app.get('/logout', function(req, res) {
    res.cookie('access-token', "", { maxAge : 1 });
    res.redirect('/Login' );
  });



const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
 });
