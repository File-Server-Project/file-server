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
            if(err) return console.error(err.message);

            console.log("User added successfully");
            res.json("User added successfully");
        }
    );

  

    res.json("User was Created");
})


// Get all users
usersRouter.get('/', async (req, res) => {
    const query = 'SELECT * FROM users';

    await db.run(query, (err, rows) => {
        if(err) return console.error(err.message);
       
        res.json(rows);
    } )
    
})

// Get individual User
// usersRouter.get('/:id', async(req, res) => {
//     const id = req.params;
//     const query = 'SELECT * FROM users WHERE userId = ';
//     await db.run(query);
// });

module.exports = usersRouter;