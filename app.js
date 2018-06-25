const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

var fs = require('fs');
sw = require('stopword');

var config = JSON.parse(fs.readFileSync('./scoring.conf', 'utf8'));
var foundersJson = JSON.parse(fs.readFileSync('./data/founders.json', 'utf8'));
var coachesJson = JSON.parse(fs.readFileSync('./data/coaches.json', 'utf8'));

var coaches = Array.from(coachesJson.coaches);
var founders = Array.from(foundersJson.founders);
var obligations = Array.from(config.obligations);
var categories = Array.from(config.categories);

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

app.get('/knowledge', (req, res) => {
    res.send({ express: 'Hello From knowledge' });
});

app.get('/api/coaches', (req, res) => {
    res.send({ express: coaches });
});

app.get('/api/founders', (req, res) => {
    res.send({ express: founders });
});

app.get('/api/config', (req, res) => {
    res.send({ express: config });
});


app.listen(port, () => console.log(`Listening on port ${port}`));



