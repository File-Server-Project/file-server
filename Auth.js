   const {Users, Files, Downloads, Emailings} = require('./models/users');
   const crypto = require('crypto');
   const nodemailer = require('nodemailer');
   const jwt = require('jsonwebtoken');
   const bcrypt = require('bcrypt');
   const cookie = require('cookie-parser');
const { render } = require('ejs');
const { check, validationResult } = require('express-validator');



const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth:{
        user: 'aronzy.as@gmail.com',
        pass: 'Sabbathday7'
    },
    tls:{
        rejectUnauthorized : false
    }
})





const signup = async (req, res) => {
       try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
          //return res.status(422).jsonp(errors.array())
          const alert = errors.array();
          res.render('Register', {alert});
        }
        //signup begins
        console.log(req.body);
        const {username, email, password, confirmpassword} = req.body;

        if(password !== confirmpassword) { redirect('/Register'); }

        await Users.findOne({email}).exec((err, user) => {
          if(user) {
            return res.status(400).json({error: "user with this email already exists."});
          }
          let newUser = new Users({
              username, 
              email, 
              password,
              emailToken : crypto.randomBytes(64).toString('hex'),
              isVerified: false
            });

            newUser.save();
 /*
          const salt = bcrypt.genSalt(10);
          const hashPassword = bcrypt.hash(newUser.password.toString(), salt.toString());
          newUser.password = hashPassword;
          newUser.save();
         newUser.save((err, success) => {
            if(err) {
              console.log("Error in signup: ", err);
              return res.status(400).json({error: err})
             }
            res.json({message: "Signup success!"})
          })*/

          //send verification mail to user
          const mailOptions = {
              from: ' "Verify your email" <aronzy.as@gmail.com>',
              to: newUser.email,
              subject: 'fileserver -verify your mail',
              html: `<h2> ${newUser.username}! Thanks for registering on our site </h2>
                      <h4> Please verify your mail to continue...</h4>
                      <a href="http://${req.headers.host}/server/ verifyemail?token=${newUser.emailToken}">Verify  Your Email</a>`
          }; 

          transporter.sendMail(mailOptions, function(error, info) {
              if(error) {
                  console.log(error);
              } else {
                  console.log('Verification email is sent to your gmail account')
              }
          })
        })
        
       // res.redirect('/Login');

       } catch(err) {
           console.log(err);
       }
    
  };



const  verifyemail = async (req, res) => {
    try {
        const token = req.query.token;
        const user = await Users.findOne({ emailToken : token });
        if(user) {
            user.emailToken = null;
            user.isVerified = true;
            await user.save();
            res.redirect('/Login');
        } else {
            res.redirect('/Register');
            console.log('email is not verified');
        }

    } catch(err) {
        console.log(err);
    }
};





const createToken = (id) => {
      return jwt.sign({ id }, process.env.JWT_SECRET);
  }


const login = async(req, res) => {
      try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
          //return res.status(422).jsonp(errors.array())
          const alert = errors.array();   
          res.render('Login', {alert});
        }

        const {username, email, password} = req.body;
        const findUser = await Users.findOne({ email : email });
        if(findUser) {
            //const match = await bcrypt.compare(password, findUser.password);
            if(/*match*/password === findUser.password) {
               // const uploadform = username === process.env.ADMIN
               process.env.user || username;
                //create token
                const token = createToken(findUser.userid);
                console.log(token);
                //store token in cookie
                res.cookie('access-token', token);
                res.redirect('/index', {items: 'undefined'});

            } else {
                console.log('Invalid Password');
            }
        } else {
            console.log('User not registered');
        }

      } catch(err) {
          console.log(err);
      }
  };

 
  



 module.exports = { transporter, signup, verifyemail, createToken, login };