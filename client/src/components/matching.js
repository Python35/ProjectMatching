import React from 'react';

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

function score(coach,founder, config){
    var obligations = Array.from(config.obligations);
    var categories = Array.from(config.categories);

    var totalScore = 0;
    // obligatory check
    var obligationCheck = true;
    obligations.forEach(function(obligation){
        if (calcCommonElements(coach[obligation], founder[obligation]) == 0){
            obligationCheck = false;
            return "NA - Obligations not passed" + obligation;
        }
    });

    // categories scoring
    if (obligationCheck){
        categories.forEach(function(category){

            totalScore = totalScore + calcCommonElements(coach[category], founder[category]) * config["score"+category];
        });

        if (coach["type"] === "vorort" || founder["type"] === "vorort" ){
            // distance reduction
            var distanceReduction = ( coach["zipCode"] - founder["zipCode"] ) * config["distanceFactor"];
            totalScore = totalScore - distanceReduction;
            console.log(founder["name"] + " score: " + totalScore + " distanceReduction: " + distanceReduction)
            return totalScore + " distance";
        }else {
            console.log(founder["name"] + " score: " + totalScore)
            return totalScore;
        }
    }
    return 0
}

function matchAlgo(coaches, founders, config){

    var obligations = Array.from(config.obligations);
    var categories = Array.from(config.categories);

    var matches = [];

    coaches.forEach(function(coach){
        var match = {coach: coach.name};
        console.log(coach.name);
        founders.forEach(function(founder){
            var totalScore = 0;
            // obligatory check
            var obligationCheck = true;
            obligations.forEach(function(obligation){
                if (calcCommonElements(coach[obligation], founder[obligation]) == 0){
                    obligationCheck = false;
                    match[founder.name] =  "NA";
                }
            });

            // categories scoring
            if (obligationCheck){
                categories.forEach(function(category){
                    totalScore = totalScore + calcCommonElements(coach[category[0]], founder[category[1]]) * category[2];
                });

                if (coach["type"] === "vorort" || founder["type"] === "vorort" ){
                    // distance reduction
                    var distanceReduction = ( coach["zipCode"] - founder["zipCode"] ) * config["distanceFactor"];
                    totalScore = totalScore - distanceReduction;
                    console.log(founder["name"] + " score: " + totalScore + " distanceReduction: " + distanceReduction)
                    match[founder.name] =  totalScore;
                }else {
                    console.log(founder["name"] + " score: " + totalScore);
                    match[founder.name] =  totalScore;
                }
            }
        });
        matches.push(match);
    });

    return matches;

}


export {score, matchAlgo };

