var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./scoring.conf', 'utf8'));
var foundersJson = JSON.parse(fs.readFileSync('./data/founders.json', 'utf8'));
var coachesJson = JSON.parse(fs.readFileSync('./data/coaches.json', 'utf8'));


function calcCommonElements(arr1, arr2) {
    var score = 0;
    for (var i = 0, len1 = arr1.length; i < len1; i++) {
        for (var j = 0, len2 = arr2.length; j < len2; j++) {
            //console.log(arr1[i]);
            //console.log(arr2[j]);
            if (arr1[i] === arr2[j]){
                score = score + 1;
                //console.log("EQUAL: " +arr1[i] + " und " + arr2[j] + " Score: " + score);
            }
        }
    }

    return score;
}

var coaches = Array.from(coachesJson.coaches);
var founders = Array.from(foundersJson.founders);
var obligations = Array.from(config.obligations);
var categories = Array.from(config.categories);

coaches.forEach(function(coach){
    console.log(coach.name);
    founders.forEach(function(founder){
        var totalScore = 0;
        // obligatory check
        var obligationCheck = true;
        obligations.forEach(function(obligation){
            if (calcCommonElements(coach[obligation], founder[obligation]) == 0){
                obligationCheck = false;
                console.log(founder["name"] + " obligation check not passed: " + obligation + " coach: " + coach[obligation] + " founder: " + founder[obligation]);

            }
        });

        // categories scoring
        if (obligationCheck){
            categories.forEach(function(category){

                totalScore = totalScore + calcCommonElements(coach[category], founder[category]) * config["score"+category];
                //console.log("totalScore "+ category + " increased by " +totalScore);
            });

            if (coach["type"] === "vorort" || founder["type"] === "vorort" ){
                // distance reduction
                var distanceReduction = ( coach["zipCode"] - founder["zipCode"] ) * config["distanceFactor"];
                totalScore = totalScore - distanceReduction;
                console.log(founder["name"] + " score: " + totalScore + " distanceReduction: " + distanceReduction)
            }else {
                console.log(founder["name"] + " score: " + totalScore)
            }

        }
    });
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
