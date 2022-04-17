// JS script here
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');

// set the view engine to ejs
app.set('views', './public');
app.set('view engine', 'ejs');
app.use(express.static( `public`));

const urlencodedParser = bodyParser.urlencoded({ extended : true });
// use res.render to load up an ejs view file

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

app.post('/login', function(req, res) {
  res.redirect('/Index');
});



app.post('/register', function(req, res) {
    res.redirect('/Register');
  });


  app.get('/search', function(req, res) {
    res.render('index');
  });

app.listen(8080, () => {
    console.log('Server is listening on port 8080')
 });
