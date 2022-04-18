// JS script here
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { extname, resolve } = require('path');

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
      .isEmpty()
      .isEmail()
      .normalizeEmail(),
  check('password', 'Invalid password').isEmpty().isLength({ min: 7 })

], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      //return res.status(422).jsonp(errors.array())
      const alert = errors.array();

      res.render('Login', {alert});
    }
    //res.redirect('/Register');
    res.json(req.body);
  });


app.post('/register', urlencodedParser, [
  check('username', 'This username must be 3+ characters long')
      .exists()
      .isLength({ min: 3 }),
  check('email', 'Email is not valid')
      .isEmpty()
      .isEmail()
      .normalizeEmail(),
  check('password', 'Invalid password').isEmpty().isLength({ min: 7 })

], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      //return res.status(422).jsonp(errors.array())
      const alert = errors.array();

      res.render('Register', {alert});
    }
    //res.redirect('/Register');git remote -v
    
    res.json(req.body);
  });

  app.post('/upload', upload.single('upload'), (req, res) => {
     // res.redirect('/Index');
     //console.log(req);
     //console.log(req.body);
     //console.log(req.file);
     res.json(req.body);
    });




  app.get('/search', function(req, res) {
    res.render('index');
  });

app.listen(8080, () => {
    console.log('Server is listening on port 8080')
 });
