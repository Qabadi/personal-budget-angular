// Budget API

// Budget API

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(cors());

let budget;

// Read budget data from the JSON file
fs.readFile('budget.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading budget data:", err);
        return;
    }
    budget = JSON.parse(data);
});

app.use('/', express.static('public'))

app.get("/budget", (req, res) => {
    res.json(budget);
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});