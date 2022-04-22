  // const {Users, Files, Downloads, Emailings} = require('./models/users');
   const crypto = require('crypto');
   const nodemailer = require('nodemailer');
   const jwt = require('jsonwebtoken');
   const bcrypt = require('bcrypt');
   const cookie = require('cookie-parser');
const { render } = require('ejs');
const { check, validationResult } = require('express-validator');



exports.transporter = nodemailer.createTransport({
    service : 'gmail',
    auth:{
        user: 'aronzy.as@gmail.com',
        pass: 'Sabbathday7'
    },
    tls:{
        rejectUnauthorized : false
    }
})





exports.signup = async (req, res) => {
       try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
          //return res.status(422).jsonp(errors.array())
          const alert = errors.array();
          res.render('Register', {alert});
        }
        //signup begins
       const {username, email, password, confirmpassword } = req.body;
       console.log(username, email, password);

       const query = 'INSERT INTO files (name, email, password) VALUES (?, ?, ?)';
  
           await db.run(
               query,
               [username, , email, password, ],
               (err) => {
                   if(err) return console.error(err.message);
                   console.log("User added Succesfully");
                   // res.json("User added successfully");
                   res.redirect('/Login');
                  //  res.redirect('/Login');
               }
           );

          //send verification mail to user
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
            subject: "Verify Email", // Subject line
            text: "Click this link to Verify your email", // plain text body
            html: `<p>Highlight the link below and click "go to to http://localhost:8080/Login" to verify your email</p> </br> <a>http://localhost:8080/Login</a>`, // html body
          };
          // send mail with defined transport object
          transporter.sendMail(msg, function(err, info) {
            if(err) {
              console.log(err);
            } else {
              console.log('Verification email is sent to your gmail account');
            }
          });
        
        
       // res.redirect('/Login');

       } catch(err) {
           console.log(err);
       }
    
  };



exports.verifyemail = async (req, res) => {
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






exports.createToken = (id) => {
      return jwt.sign({ id }, process.env.JWT_SECRET);
  }





  //Login
exports.login = async(req, res) => {
      try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
          //return res.status(422).jsonp(errors.array())
          const alert = errors.array();   
          res.render('Login', {alert});
        }

        const {username, email, password} = req.body;
        console.log(username, email, password);
        //const findUser = await Users.findOne({ email : email });
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
      } catch(err) {
          console.log(err);
      }
  };




  //Forget Password
exports.forgetpassword =  async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      //return res.status(422).jsonp(errors.array())
      const alert = errors.array();
      res.render('ForgetPassword', {alert});
    }


      const {username, email} = req.body;
      console.log(username, email);

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
              html: `<p>Highlight the link below and click "go to to http://localhost:8080/ResetPassword?email=${email}" to reset your password</p> </br> <a>http://localhost:8080/ResetPassword</a>`, // html body
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
  };



  //reset Password
  exports.reset = async (req, res) => {
    try {
      const errors = validationResult(req)
    if(!errors.isEmpty()) {
      //return res.status(422).jsonp(errors.array())
      const alert = errors.array();
      res.render('ForgetPassword', {alert});
    }

    const {newPassword, confirmPassword} =req.body;
    const email = req.query;
    console.log(email,newPassword, confirmPassword);
    if (newPassword === confirmPassword){
      const query = `UPDATE users SET password = "${newPassword}" WHERE email = "${email}"`;
   
      await db.run(
          query,
          (err) => {
              if(err) return console.error(err.message);
              console.log("Password Reset Successful");
              // res.redirect('/index');
              res.json("Password Reset Successful");
             
          }
      );
    } else {
      console.log("Passwords do not match");
      res.json("Passwords do not match");
    }

    } catch(err) {
      console.log(err);
        }
 
  };




///Upload Files
exports.fileUpload = async (req, res) => {
   try {
      // res.redirect('/Index');
    const {title, description} = req.body;
    console.log(title, description);
    console.log(req.files.upload);
    if (req.files){
     // console.log(req.files);
     
     var file = req.files.upload;
     var filename = file.name;
     file.mv("./uploadedFiles/"+filename, async (err) => {
         if (err){
             console.log(err);
             res.send("error occured");
         }
         else{
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
             // res.send("Done!");
         }
     });
 }
   
   } catch(err) {
     console.log(err);
   }
 }

 exports.fileSearch = async (req, res) => {
   try {
    const {search} = req.body;
    console.log(search);
    const query = `SELECT * FROM files WHERE title LIKE "%${search}%" OR description LIKE "${search}%"`;
    
    await db.all(query, (err, items) => {
     if(err) return console.error(err.message);
     console.log(items.length);
     if (items.length === 0){
         res.json("No such file");
         console.log("No such file");
     }else{
         console.log(items);
         res.render('index',{items: items});
 
     }
 });
   } catch(err) {
     console.log(err);
   }
 };

  
exports.feedPage = async (req, res) => {
  try {
    const query = 'SELECT * FROM files';
  
           await db.run(
               query,
               (err, items) => {
               if(err) return console.error(err.message);

               if(items.length === 0) {
                  res.json("No such file");
                  console.log("No such file");
                } else {
                   console.log(items);
                res.render('feedPage',{items: items});
        
                   //res.json("No File Exists");
                  //  res.redirect('/Login');
               }
              });
     
  } catch(err) {
    console.log(err);
  }
} 



 //module.exports = { transporter, signup, verifyemail, createToken, login };
