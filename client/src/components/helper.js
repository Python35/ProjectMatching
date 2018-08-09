
function getCoachFromName(_this, name){
    var coaches = Array.from(_this.state.coaches);
    var retObj = 0;
    coaches.forEach(function(coach){
        if (coach.name === name){
            console.log("got coach" + name);
            retObj = coach;
        }
    });
    return retObj;
}

function getFounderFromName(_this, name){
    var founders = Array.from(_this.state.founders);
    var retObj = 0;
    founders.forEach(function(founder){
        if (founder.name === name){
            console.log("got founder" + name);
            retObj = founder;
        }
    });
    return retObj;
}


export {getCoachFromName, getFounderFromName};
