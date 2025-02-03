const express = require('express');
const pool = require('./config/db');
const app = express();

const PORT = 8080;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("API is working");
});


app.listen(PORT, () => {
    console.log("Connected to Port 8080");
});

