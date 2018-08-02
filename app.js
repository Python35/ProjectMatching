const express = require('express');



const app = express();
const port = process.env.PORT || 5000;

var fs = require('fs');
var sw = require('stopword');

var config = JSON.parse(fs.readFileSync('./scoring.conf', 'utf8'));
var foundersJson = JSON.parse(fs.readFileSync('./data/founders.json', 'utf8'));
var coachesJson = JSON.parse(fs.readFileSync('./data/coaches.json', 'utf8'));
var privateKey = JSON.parse(fs.readFileSync('./keys.conf', 'utf8'));

var coaches = Array.from(coachesJson.coaches);
var founders = Array.from(foundersJson.founders);
var obligations = Array.from(config.obligations);
var categories = Array.from(config.categories);

var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

var googleMapsClient = require('@google/maps').createClient({
    key: privateKey.googleAPIKey
});


coaches.forEach(function(coach,i) {
    googleMapsClient.geocode({
        address: "Deutschland " + coach.zipCode
    }, function(err, response) {
        if (!err) {
            coaches[i].lat =response.json.results[0].geometry.location.lat;
            coaches[i].lng =response.json.results[0].geometry.location.lng;
        }
    });
});

founders.forEach(function(founder,i){
    googleMapsClient.geocode({
        address: "Deutschland " + founder.zipCode
    }, function(err, response) {
        if (!err) {
            console.log("lat " + JSON.stringify(response.json.results[0].geometry.location.lat));
            console.log("lon " + JSON.stringify(response.json.results[0].geometry.location.lng));
            founders[i].lat=response.json.results[0].geometry.location.lat;
            founders[i].lng=response.json.results[0].geometry.location.lng;
        }
    });
});


app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

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


app.post('/api/save', function(req, res) {
    console.log(req.body.coaches);
    console.log(req.body.founders);
    console.log(req.body.config);

    fs.writeFileSync("./data/founders.json",JSON.stringify(req.body.founders),{encoding:'utf8',flag:'w'});
    fs.writeFileSync("./data/coaches.json",JSON.stringify(req.body.coaches),{encoding:'utf8',flag:'w'});
    fs.writeFileSync("./scoring.conf",JSON.stringify(req.body.config),{encoding:'utf8',flag:'w'});

    res.send({express: 'Success'})
});


app.listen(port, () => console.log(`Listening on port ${port}`));



