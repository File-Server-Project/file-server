// const sqlite3 = require('sqlite3').verbose(); 
const express = require('express');
// const { appendFile } = require('fs');
// const { brotliDecompress } = require('zlib');
const usersRouter = express.Router();
const db = require('../dbConnection');

// const {transporter} = require('../email');
const nodemailer = require("nodemailer");



// Sign up Users
usersRouter.post('/signUp', (req, res) => {
    const {name, email, password, userRole} = req.body;
    // console.log(name);
    const query = 'INSERT INTO users (name, email, password, userRole) VALUES (?, ?, ?, ?)';
   
    db.run(
        query,
        [name, email, password, userRole],
        (err) => {
            if(err) return console.error(err.message);

            console.log("User added successfully");
            res.json("User added successfully");
        }
    );



    // db.close((err) => {
    //     if (err) return console.error(err.message);
    //  });

    // res.json("User was Created");
})

//  Login user
usersRouter.post('/login', async(req, res) => {
    const {email, password} = req.body;
    console.log(email, password);
    const query = `SELECT * FROM users WHERE email LIKE "%${email}%" AND password LIKE "%${password}%" `;
   
    await db.all(query, (err, rows) => {
        if(err) return console.error(err.message);
        console.log(rows);
        if (rows.length === 0){
            res.json("Invalid user");
        }else{
            res.json(rows);
            
        }

    } )

})

// Forgot Password
// usersRouter.post('/forgot', async(req, res) => {
    // const {email} = req.body;
    // console.log(name);
    // const query = `SELECT * FROM users WHERE email LIKE "%${email}%" `;
   
    // await db.all(query, async(err, rows) => {
        // if(err) return console.error(err.message);
        // console.log(rows);
        // if (rows.lenght === 0){
        //     res.json("Invalid user");
        // }else{
    // res.json(rows);

    // let transporter = nodemailer.createTransport({
    //     host: "smtp.ethereal.email",
    //     port: 587,
    //     secure: false, // true for 465, false for other ports
    //     auth: {
    //       user: "kyle.daniel25@ethereal.email", // generated ethereal user
    //       pass: "Q7MQWnPDFaWKcGfGFm", // generated ethereal password
    //     },
    // });

    // const msg = {
    //     from: '"Isaac Ampomah 👻" <isaac.ampomah@amalitech.com>', // sender address
    //     to: "isaacampomah12@gmail.com, ampomahi@eaiinfosys.onmicrosoft.com", // list of receivers
    //     subject: "Hello ✔", // Subject line
    //     text: "Hello world?", // plain text body
                // html: "<b>Hello world?</b>", // html body
    // }
              // send mail with defined transport object
    // let info = await transporter.sendMail(msg);

    // console.log("Message sent: %s", msg.messageId);
              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            
              // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
              // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            
    //     }

    // } )

// })

// Get all users
// usersRouter.get('/', async (req, res) => {
//     const query = 'SELECT * FROM users';

//     await db.all(query, (err, rows) => {
//         if(err) return console.error(err.message);
//         console.log("Get all");
//         res.json(rows);
//     } )
    
// })

usersRouter.get('/', async (req, res) => {
    const query = 'SELECT * FROM users';

    await db.all(query, [], (err, rows) => {
        if(err) return console.error(err.message);

        res.json(rows);
    } )
    
})

// Get individual Users
usersRouter.get('/:id', async(req, res) => {
    const {id} = req.params;

    const query = `SELECT * FROM users WHERE userId = ${id}`;
    await db.all(query, [], (err, rows) => {
        if(err) return console.error(err.message);

        res.json(rows);
    } )
});

// Update individual Users
usersRouter.put('/:id', async(req, res) => {
    const {id} = req.params;
    const {name, email, password, userRole} = req.body;

    const query = `UPDATE users SET name = "${name}", email = "${email}", password = "${password}", userRole = "${userRole}" WHERE userId = ${id}`;
    await db.run(query, (err) => {
        if(err) return console.error(err.message);

        res.json("user Successfully updated");
    } )
});

// Reset Password Users
usersRouter.patch('/:id', async(req, res) => {
    const {id} = req.params;
    const {password} = req.body;

    const query = `UPDATE users SET password = "${password}" WHERE userId = ${id}`;
    await db.run(query, (err) => {
        if(err) return console.error(err.message);

        res.json("password Successfully updated");
    } )
});

// Delete individual Users
usersRouter.delete('/:id', async(req, res) => {
    const {id} = req.params;

    const query = `DELETE FROM users WHERE userId = ${id}`;
    await db.run(query, (err) => {
        if(err) return console.error(err.message);

        res.json("user Successfully Deleted");
    } )
});

module.exports = usersRouter;