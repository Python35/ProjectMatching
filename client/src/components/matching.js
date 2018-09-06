
var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

function calcCommonElements(arr1, arr2) {

    var score = 0;
    for (var i = 0, len1 = arr1.length; i < len1; i++) {
        for (var j = 0, len2 = arr2.length; j < len2; j++) {
            if (arr1[i] === arr2[j]){
                score = score + 1;
            }
        }
    }
    return score;
}


function calcAdvOrthodromeDistance(longA, longB, latA, latB) {
    var distance;
    var absplattung = 1 / 298.257223563;
    var aequatorradius = 6378.137;
    var f = (latA + latB) / 2;
    var g = (latA - latB) / 2;
    var l = (longA - longB) / 2;
    var s = Math.pow(Math.sin(/* toRadians */ (function (x) { return x * Math.PI / 180; })(g)), 2) * Math.pow(Math.cos(/* toRadians */ (function (x) { return x * Math.PI / 180; })(l)), 2) + Math.pow(Math.cos(/* toRadians */ (function (x) { return x * Math.PI / 180; })(f)), 2) * Math.pow(Math.sin(/* toRadians */ (function (x) { return x * Math.PI / 180; })(l)), 2);
    var c = Math.pow(Math.cos(/* toRadians */ (function (x) { return x * Math.PI / 180; })(g)), 2) * Math.pow(Math.cos(/* toRadians */ (function (x) { return x * Math.PI / 180; })(l)), 2) + Math.pow(Math.sin(/* toRadians */ (function (x) { return x * Math.PI / 180; })(f)), 2) * Math.pow(Math.sin(/* toRadians */ (function (x) { return x * Math.PI / 180; })(l)), 2);
    var w = Math.atan(Math.sqrt(s / c));
    var distanceSimple = 2 * w * aequatorradius;
    var t = Math.sqrt(s * c) / w;
    var h1 = (3 * t - 1) / (2 * c);
    var h2 = (3 * t + 1) / (2 * s);
    distance = distanceSimple * (1 + absplattung * h1 * Math.pow(Math.sin(/* toRadians */ (function (x) { return x * Math.PI / 180; })(f)), 2) * Math.pow(Math.cos(/* toRadians */ (function (x) { return x * Math.PI / 180; })(g)), 2) - absplattung * h2 * Math.pow(Math.cos(/* toRadians */ (function (x) { return x * Math.PI / 180; })(f)), 2) * Math.pow(Math.sin(/* toRadians */ (function (x) { return x * Math.PI / 180; })(g)), 2));
    return distance;
}

function matchAlgo(coaches, founders, config){

    var matches2 = [];


    coaches.forEach(function(coach){
        coach["sdgMatch"] = [];

        for (var x = 0; x < config.sdgCoachLvl.length; x++) {
            if (coach[config.SdgCoach].indexOf(config.sdgCoachLvl[x]) !== -1) {
                coach["sdgMatch"].push(x);
            }
        }
    });


    founders.forEach(function(founder){
        founder["profitMatch"] = founder[config.profitFounder].replace(/[�]/g , "");

        founder["sdgMatch"] = [];
        var matchStr = founder[config.SdgFounder].replace(/[� ]/g , "");

        for (var i = 0; i < config.sdgFounderLvl.length; i++) {
            if (matchStr.indexOf(config.sdgFounderLvl[i]) !== -1) {
                founder["sdgMatch"].push(i);
            }
        }
    });



    coaches.forEach(function(coach){
        founders.forEach(function(founder){
            var match2 = {"founder":founder["Vorname"]+ " " + founder[config.identFounder]};
            match2["coach"] = coach["Vorname"]+ " " + coach[config.identCoach] ;
            var totalScore = 0;

            var obligationCheck = true;

            // Essentiell
            // Sprache
            match2["checkSprache"] = true;

            if (founder["Erstprache"]==="Deutsch" && coach["Deutsch"].indexOf("Deutsch") === -1 && coach["Erstprache"].indexOf("Deutsch")=== -1){
                obligationCheck = false;
                match2["checkSprache"] = false;
            }else if (coach["Englisch"].indexOf("Deutsch") !== -1){
                obligationCheck = false;
                match2["checkSprache"] = false;
            }

            match2["checkAlter"] = true;
            if (!isNaN(coach[config.alter]) && !isNaN(founder[config.alter])){
                // Alter überprüfung: Alter vom Coach > Alter vom Gründer
                if (coach[config.alter]>founder[config.alter] ){
                    obligationCheck = false;
                    match2["checkAlter"] = false;
                }
            }

            if (obligationCheck) {
                // Hoch
                match2["erfahrungMatch"] = 0;

                //Erfahrung Mapping

                switch (coach["Vorerfahrungen Coaching"]) {
                    case config.expCoachLvl[0]:
                        if (founder["Erfahrung"] === config.expFounderLvl[0]) {
                            totalScore = totalScore + config.scoreExperiencePlus[0];
                            match2["erfahrungMatch"] = config.scoreExperiencePlus[0];
                        }else{
                            totalScore = totalScore - config.scoreExperienceminus[0];
                            match2["erfahrungMatch"] = (-1) * config.scoreExperienceMinus[0];
                        }
                        break;
                    case config.expCoachLvl[1]:
                        if (founder["Erfahrung"] === config.expFounderLvl[0]) {
                            totalScore = totalScore + config.scoreExperiencePlus[1];
                            match2["erfahrungMatch"] = config.scoreExperiencePlus[1];
                        }else if (founder.experience === config.expFounderLvl[1]){
                            match2["erfahrungMatch"] = 0;
                        }else{
                            totalScore = totalScore - config.scoreExperienceMinus[1];
                            match2["erfahrungMatch"] = (-1) * config.scoreExperienceMinus[1];
                        }
                        break;
                    case config.expCoachLvl[2]:
                        if (founder["Erfahrung"] === config.expFounderLvl[1]) {
                            totalScore = totalScore + config.scoreExperiencePlus[2];
                            match2["erfahrungMatch"] = config.scoreExperiencePlus[2];
                        }else{
                            match2["erfahrungMatch"] = 0;
                        }
                        break;
                    case config.expCoachLvl[3]:
                        if (founder["Erfahrung"] === config.expFounderLvl[2]) {
                            totalScore = totalScore + config.scoreExperiencePlus[3];
                            match2["erfahrungMatch"] = config.scoreExperiencePlus[3];
                        }else if (founder["Erfahrung"] === config.expFounderLvl[0]){
                            totalScore = totalScore - config.scoreExperienceMinus[3];
                            match2["erfahrungMatch"] =(-1) * + config.scoreExperienceMinus[3];
                        }else{
                            match2["erfahrungMatch"] = 0;
                        }
                        break;
                    default:
                }

                match2["scoreThema"] = 0;
                //Thema
                if (coach.hasOwnProperty(config.ThemaCoach) && founder.hasOwnProperty(config.ThemaFounder)) {
                    if (coach[config.ThemaCoach] !== "" && founder[config.ThemaFounder] !== "") {
                        if (coach[config.ThemaCoach] === founder[config.ThemaFounder]){
                            console.log("Thema +");
                            match2["scoreThema"] = config.scoreThema;
                            totalScore = totalScore + config.scoreThema;
                        }
                        /*
                        console.log("thema coach: " + coach[config.thema]);
                        console.log("thema founder: " + founder[config.thema]);
                        var scoreThema = calcCommonElements(coach[config.thema], founder[config.thema]) * config.scoreThema;
                        match2["scoreThema"] = scoreThema;
                        totalScore = totalScore + scoreThema;*/
                    }
                }



                match2["scoreSdg"] = 0;
                //Thema
                if (coach["sdgMatch"].length !== 0 && founder["sdgMatch"].length !== 0) {
                        var scoreSdg = calcCommonElements(coach["sdgMatch"], founder["sdgMatch"]) * config.scoreSdg;
                        match2["scoreSdg"] = scoreSdg;
                        totalScore = totalScore + scoreSdg;
                }



                match2["scoreBedarf"] = 0;
                //Thema
                if (coach.hasOwnProperty(config.BedarfCoach) && founder.hasOwnProperty(config.BedarfFounder)) {
                    if (coach[config.BedarfCoach] !== "" && founder[config.BedarfFounder] !== "") {
                        var scoreBedarf = 0;
                        if (coach.hasOwnProperty(config.BedarfCoach2) && coach[config.BedarfCoach2] !== ""){
                            scoreBedarf = calcCommonElements((coach[config.BedarfCoach]+coach[config.BedarfCoach2]).split(","), founder[config.BedarfFounder].split(",")) * config.scoreBedarf;

                        }else{
                            scoreBedarf = calcCommonElements(coach[config.BedarfCoach].split(","), founder[config.BedarfFounder].split(",")) * config.scoreBedarf;
                        }
                        match2["scoreBedarf"] = scoreBedarf;
                        totalScore = totalScore + scoreBedarf;

                    }
                }

                // Mittel

                //Priorität
                if (coach.hasOwnProperty(config.prio) && founder.hasOwnProperty(config.prio)){
                    if (coach[config.prio]!=="" && founder[config.prio]!=="") {
                        var scorePrio = (10 - Math.abs(coach[config.prio] - founder[config.prio])) * config.scorePrio;
                        match2["scorePrio"] = scorePrio;
                        totalScore = totalScore + scorePrio;
                    }
                } else{
                    match2["scorePrio"] = 0;
                }


                // Distanz
                match2["distanzBonus"] = 0;
                if (founder.hasOwnProperty("lat") && founder.hasOwnProperty("lng") && coach.hasOwnProperty("lat") && coach.hasOwnProperty("lng")) {
                    if (founder.lat !== "" && founder.lng !== "" && coach.lat !== "" && coach.lng !== "") {
                        if (calcAdvOrthodromeDistance(founder.lng, coach.lng, founder.lat, coach.lat) < 100) {
                            totalScore = totalScore + config.scoreDistanzBonus;
                            match2["distanzBonus"] = config.scoreDistanzBonus;
                        }
                    }
                }

                //Niedrig

                /* Interessen
                if (founder.hasOwnProperty(config.interessen) && coach.hasOwnProperty(config.interessen)) {
                    if (coach[config.interessen]!=="" && founder[config.interessen]!=="") {
                        var scoreInteressen = calcCommonElements(coach[config.interessen], founder[config.interessen]) * config.scoreInteressen;
                        match2["scoreInteressen"] = 11;
                        totalScore = totalScore + scoreInteressen;
                    }
                } else  {
                    match2["scoreInteressen"] = 0;
                }
                */
                match2["profitMatch"] = 0;
                //Profit

                console.log("coach.profitCoach" + coach[config.profitCoach]);
                console.log("founder[\"profitMatch\"]" + founder["profitMatch"]);
                switch (coach[config.profitCoach]) {
                    case config.profitCoachLvl[0]:
                        if (config.profitFounderMatchNonProfit.indexOf(founder["profitMatch"] ) !== -1) {
                            totalScore = totalScore + config.scoreProfit[0];
                            match2["profitMatch"] = config.scoreProfit[0];
                            console.log("config.scoreProfit[0]: " + config.scoreProfit[0]);
                        }
                        break;
                    case config.profitCoachLvl[1]:
                        if (config.profitFounderMatchForProfit.indexOf(founder["profitMatch"] ) !== -1) {
                            totalScore = totalScore + config.scoreProfit[1];
                            match2["profitMatch"] = config.scoreProfit[1];
                            console.log("config.scoreProfit[0]: " + config.scoreProfit[1]);
                        }
                        break;
                    case config.profitCoachLvl[2]:
                        if (config.profitFounderMatchNoPrefPrio1.indexOf(founder["profitMatch"] ) !== -1) {
                            totalScore = totalScore + config.scoreProfit[2];
                            match2["profitMatch"] = config.scoreProfit[2];
                            console.log("config.scoreProfit[0]: " + config.scoreProfit[2]);
                        }
                        if (config.profitFounderMatchNoPrefPrio2.indexOf(founder["profitMatch"] ) !== -1) {
                            totalScore = totalScore + config.scoreProfit[3];
                            match2["profitMatch"] = config.scoreProfit[3];
                            console.log("config.scoreProfit[0]: " + config.scoreProfit[3]);
                        }
                        break;
                    default:

                }
                match2["totalScore"] = totalScore;
            }else{
                match2["erfahrungMatch"] = 0;
                match2["scoreThema"] = 0;
                match2["scoreSdg"] = 0;
                match2["scoreBedarf"] = 0;
                match2["scorePrio"] = 0;
                match2["distanzBonus"] = 0;
                match2["profitMatch"] = 0;
                match2["totalScore"] = 0;
            }
            matches2.push(match2);
        });
    });

    matches2.sort((a,b) => a.totalScore - b.totalScore);
    matches2.sort(function(obj1, obj2) {
        return obj2.totalScore - obj1.totalScore;
    });
    matches2 = groupBy(matches2, "founder");
    return Object.values(matches2);
}
export { matchAlgo };

