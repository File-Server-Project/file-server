const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const {Users, Files, Downloads, Emailings }= require('./models/users');


exports.loginrequired = async (req, res, next) => {
    const token = req.cookies['access-token'];
    if(token) {
        const validatoken = await jwt.verify(token, process.env.JWT_secret)
        if(validatoken) {
            res.user = validatoken.userid;
            next();

        } else {
            console.log('token expired');
            res.redirect('/Login'  );
        }
    } else {
        console.log('token not found');
        res.redirect('/Login');
    }
}




exports.mustVerifyEmail = async (req, res, next) => {
    try {
        const user = await Users.findOne({ email : req.body.email });
        if(user.isVerified) {
            next();
        } else {
            console.log('Please check your email to verify your account');
            res.send('Your account is Unverified');
        }

    } catch(err) {
        console.log(err);
    }
}



//module.exports = { loginrequired, mustVerifyEmail };