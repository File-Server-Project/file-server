const sqlite3 = require('sqlite3').verbose(); 
const express = require('express');
const { appendFile } = require('fs');
const { brotliDecompress } = require('zlib');
const usersRouter = express.Router();
const db = require('../dbConnection');

// Create User
usersRouter.post('/', (req, res) => {
    const {name, email, password} = req.body;
    // console.log(name);
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
   
    db.run(
        query,
        [name, email, password],
        (err) => {
            console.error("add success");
        }
    );

    db.close((err) => {
        if (err) return console.error(err.message);
     });

    res.json("User was Created");
})



module.exports = usersRouter;