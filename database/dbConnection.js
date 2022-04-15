const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(
    './files.db', 
    sqlite3.OPEN_READWRITE,
    (err) => {
        if (err) return console.error(err.message);

        console.log('connection successful');
    });

// Create users table
db.run('CREATE TABLE users ("userId"	INTEGER NOT NULL,"name"	TEXT,"email"	TEXT,"password"	TEXT,PRIMARY KEY("userId" AUTOINCREMENT))');

db.close((err) => {
   if (err) return console.error(err.message);
});