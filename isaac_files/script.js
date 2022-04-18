// JS script here
const express = require('express');
const app = express();

app.use(express.json());

// User Router
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

// Files Router
const filesRouter = require('./routes/files.js');
app.use('/files', filesRouter);

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});