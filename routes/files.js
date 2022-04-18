const sqlite3 = require('sqlite3').verbose(); 
const express = require('express');
const { appendFile } = require('fs');
const { brotliDecompress } = require('zlib');
const filesRouter = express.Router();
const db = require('../dbConnection');

// Create file
filesRouter.post('/', (req, res) => {
    const {fileName, description, createdBy} = req.body;
    // console.log(name);
    const query = 'INSERT INTO files (fileName, description, createdBy) VALUES (?, ?, ?)';
   
    db.run(
        query,
        [fileName, description, createdBy],
        (err) => {
            if(err) return console.error(err.message);

            console.log("File added successfully");
            res.json("File added successfully");
        }
    );
    
    // res.json("File was Created");
});

// Get all files
// filesRouter.get('/', (req, res) => {
//     const query = 'SELECT * FROM files';

//     db.run(query, [], (err, rows) => {
//         if(err) return console.error(err.message);
       
//         console.log("all files");
//         console.log(rows);
//         res.json(rows);
        
//     } )
    
// });

//  Get all files
filesRouter.get('/', async (req, res) => {
    const query = 'SELECT * FROM files';

    await db.all(query, [], (err, rows) => {
        if(err) return console.error(err.message);

        res.json(rows);
    } )
    
})


// Search for file
filesRouter.get('/search', async (req, res) => {
    const {search} = req.body;
    console.log(search);
    const query = `SELECT * FROM files WHERE fileName LIKE "%${search}%" OR description LIKE "%${search}%"`;

    await db.all(query, [], (err, rows) => {
        if(err) return console.error(err.message);

        res.json(rows);
    } )
    
})


module.exports = filesRouter;