"use strict";
// const nodemailer = require("nodemailer");
 

  // create reusable transporter object using the default SMTP transport
// let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: "kyle.daniel25@ethereal.email", // generated ethereal user
//       pass: "Q7MQWnPDFaWKcGfGFm", // generated ethereal password
//     },
// });


//   const msg = {
//     from: '"Isaac Ampomah 👻" <isaac.ampomah@amalitech.com>', // sender address
//     to: "isaacampomah12@gmail.com, ampomahi@eaiinfosys.onmicrosoft.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     // html: "<b>Hello world?</b>", // html body
//   }
//   // send mail with defined transport object
//   let info = await transporter.sendMail(msg);

//   console.log("Message sent: %s", msg.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...



module.exports = transporter;