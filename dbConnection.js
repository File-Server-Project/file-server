const sqlite3 = require('sqlite3').verbose(); 

const db = new sqlite3.Database("./database/files.db", sqlite3.OPEN_READWRITE, (err) => {
    if(err) return console.error(err.message);

    console.log("Database connection successful");
})
// Create users table
// db.run('CREATE TABLE users ("userId"	INTEGER NOT NULL,"name"	TEXT,"email"	TEXT,"password"	TEXT,PRIMARY KEY("userId" AUTOINCREMENT))');

// Create files table
// db.run('CREATE TABLE "files" ("fileId"	INTEGER NOT NULL,"fileName"	TEXT,"description"	TEXT,"createdBy"	INTEGER,FOREIGN KEY("createdBy") REFERENCES "users"("userId"),PRIMARY KEY("fileId" AUTOINCREMENT))');

// Create emails table
// db.run('CREATE TABLE "emails" ("emailId"	INTEGER NOT NULL,"emailFile"	INTEGER,PRIMARY KEY("emailId" AUTOINCREMENT),FOREIGN KEY("emailFile") REFERENCES "files"("fileId"))');

// Create downloads table
// db.run('CREATE TABLE "downloads" ("downloadId"	INTEGER NOT NULL,"downloadFile"	INTEGER,PRIMARY KEY("downloadId" AUTOINCREMENT),FOREIGN KEY("downloadFile") REFERENCES "files"("fileId"));');
// const sql = 'SELECT * FROM users';

// db.all(sql, [], (err, rows) => {
//     if(err) return console.error(err.message);
    
//     rows.forEach((row) => {
//         console.log(row);
//     })
// } )

db.close((err) => {
    if (err) return console.error(err.message);
})


module.exports = db;