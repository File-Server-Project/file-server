const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(
    './files.db',
    sqlite3.OPEN_READWRITE,
    (err) => {
        if (err) return console.error(err.message);

        console.log('connection successful');
});

//Create users table
db.run('CREATE TABLE users ("userId" INTEGER NOT NULL, "email" TEXT, "password" TEXT, PRIMARY KEY("userId" AUTOINCREMENT))');

//Create files table
db.run('CREATE TABLE "files" ("field"  INTEGER NOT NULL, "title"  TEXT, "description"  TEXT, "createdBy"  INTEGER, FOREIGN KEY("createdBy") REFERENCES "users"("userId"), PRIMARY KEY("fileId" AUTOINCREMENT))');

//Create emails table
db.run('CREATE TABLE emails ("emailId" INTEGER NOT NULL, "emailFile" INTEGER, "emailAddr" TEXT, PRIMARY KEY("emailId" AUTOINCREMENT), FOREIGN KEY("emailFile") REFERENCES "files"("fileId"))');

//Create downloads table
db.run('CREATE TABLE "downloads" ("downloadId" INTEGER NOT NULL, "downloadFile" INTEGER, PRIMARY KEY("downloadId" AUTOINCREMENT), FOREIGN KEY("downloadFile") REFERENCES "files"("fileId"))');

db.close((err) =>{
    if (err) return console.log(err.message);
});