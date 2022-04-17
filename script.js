// JS script here
const express = require('express');
const app = express();

app.use(express.json());

// Routes
const usersRouter = require('./routes/users');

app.use('/users', usersRouter);


const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});