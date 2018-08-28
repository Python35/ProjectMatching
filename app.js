const express = require('express');

var bodyParser = require('body-parser');

const json2csv = require('json2csv').parse;
const csv=require('csvtojson');

var fs = require('fs');






// encrypt data



var coaches=[];
var founders=[];
const csvProjektFilePath='./data/projekte1.csv';
const csvCoachesFilePath='./data/coaches2.csv';
const scoringConfPath = './scoring.conf';
const keysPath ='./keys.conf';


var config = JSON.parse(fs.readFileSync(scoringConfPath, 'utf8'));
var privateKey = JSON.parse(fs.readFileSync(keysPath, 'utf8'));

var googleMapsClient = require('@google/maps').createClient({
    // Google API KEY anpassen
    key: privateKey.googleAPIKey
});

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({extended: true})); // to support URL-encoded bodies
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


function getFoundersFromFileWithGeo() {
    csv().fromFile(csvProjektFilePath)
        .then((jsonObj)=>{
            founders = jsonObj;
            //console.log(JSON.stringify(founders));
            founders.forEach(function(founder,i){
                //if (false){
                if (founder.hasOwnProperty(config.plz)){
                    if (founder[config.plz]){
                        //console.log(founder[config.plz]);
                        googleMapsClient.geocode({
                            // Address Felder einfügen
                            address: founder[config.land] + " " + founder[config.plz]
                        }, function(err, response) {

                            if (!err) {
                                founders[i].lat=response.json.results[0].geometry.location.lat;
                                founders[i].lng=response.json.results[0].geometry.location.lng;
                            }

                        });
                    }
                }

            });

        });

}


function getCoachesFromFileWithGeo(){
    csv().fromFile(csvCoachesFilePath)
        .then((jsonObj)=>{
            coaches = jsonObj;

            coaches.forEach(function(coach,i) {
                //if (false){
                if (coach.hasOwnProperty(config.plz)){
                    if (coach[config.plz] !== ""){
                        googleMapsClient.geocode({
                            // Address Felder einfügen
                            address: coach[config.land] + " " + coach[config.plz]
                        }, function(err, response) {
                            if (!err) {

                                coaches[i].lat =response.json.results[0].geometry.location.lat;
                                coaches[i].lng =response.json.results[0].geometry.location.lng;
                            }
                        });
                    }
                }

            });
        });
}

getFoundersFromFileWithGeo();
getCoachesFromFileWithGeo();


/*
// Einkommentieren JSON Files
var foundersJson = JSON.parse(fs.readFileSync('./data/founders.json', 'utf8'));
var coachesJson = JSON.parse(fs.readFileSync('./data/coaches.json', 'utf8'));
coaches = Array.from(coachesJson.coaches);
founders = Array.from(foundersJson.founders);


const json2csv = require('json2csv').parse;
const fields = Object.keys(coaches[0]);
const fields2 = Object.keys(founders[0]);
const opts = { fields };
const opts2 = { fields2 };

try {
    const csv = json2csv(coaches, opts);
    const csv2 = json2csv(founders, opts2);
    fs.writeFileSync("./coaches.csv",csv,{encoding:'utf8',flag:'w'});
    fs.writeFileSync("./projekte.csv",csv2,{encoding:'utf8',flag:'w'});
} catch (err) {
    console.error(err);
}
*/


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



app.get('/api/refreshCoaches', (req, res) => {
    csv().fromFile(csvCoachesFilePath)
        .then((jsonObj)=>{
            coaches = jsonObj;
            var itemsProcessed = 0;
            coaches.forEach(function(coach,i) {
                if (coach.hasOwnProperty(config.plz) && coach.hasOwnProperty(config.land)){
                    if (coach[config.plz] !== ""){
                        googleMapsClient.geocode({
                            address: coach[config.land] + " " + coach[config.plz]
                        }, function(err, response) {
                            if (!err) {
                                coaches[i].lat=response.json.results[0].geometry.location.lat;
                                coaches[i].lng=response.json.results[0].geometry.location.lng;
                            }
                            itemsProcessed++;
                            if(itemsProcessed === coaches.filter(function (e) { return e[config.plz]!==""}).length) {
                                res.send({ express: coaches });
                            }});
                    }
                }else{
                    res.send({ express: coaches });
                }
            });
        });
});

app.get('/api/refreshFounders', (req, res) => {
    csv().fromFile(csvProjektFilePath)
        .then((jsonObj)=>{
            founders = jsonObj;
            var itemsProcessed =0;
            founders.forEach(function(founder,i){
                //if (false){
                if (founder.hasOwnProperty(config.plz) && founder.hasOwnProperty(config.land)){
                    if (founder[config.plz] !== ""){

                        googleMapsClient.geocode({
                            // Address Felder einfügen
                            address: founder[config.land] + " " + founder[config.plz]
                        }, function(err, response) {

                            if (!err) {
                                founders[i].lat=response.json.results[0].geometry.location.lat;
                                founders[i].lng=response.json.results[0].geometry.location.lng;
                            }
                            itemsProcessed++;
                            if(itemsProcessed === founders.filter(function (e) { return e[config.plz]!==""}).length) {
                                res.send({ express: founders });
                            }});
                    }
                }else{
                    res.send({ express: founders });
                }

            });

        });

});

/* NOT USED
app.post('/api/save', function(req, res) {
    console.log(req.body.coaches);
    console.log(req.body.founders);
    console.log(req.body.config);

    fs.writeFileSync("./data/founders.json",JSON.stringify(req.body.founders),{encoding:'utf8',flag:'w'});
    fs.writeFileSync("./data/coaches.json",JSON.stringify(req.body.coaches),{encoding:'utf8',flag:'w'});
    fs.writeFileSync("./scoring.conf",JSON.stringify(req.body.config),{encoding:'utf8',flag:'w'});

    res.send({express: 'Success'})
});
*/

app.post('/api/saveExportCsv', function(req, res) {


    const fields = Object.keys(req.body[0]);
    const opts = { fields };

    try {
        const csv = json2csv(req.body, opts);
        fs.writeFileSync("./exportMatchings.csv",csv,{encoding:'utf8',flag:'w'});
    } catch (err) {
        console.error(err);
        res.send({express: err})
    }

    res.send({express: 'Success'})
});

app.listen(port, () => console.log(`Listening on port ${port}`));



