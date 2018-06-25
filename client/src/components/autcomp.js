import React from 'react';

import ReactAutocomplete from "react-autocomplete";
import {getFounderFromName, getCoachFromName} from "./helper";
import {score} from "./matching";

function inputChangeHandler(selectFounder,selectStr, _this) {
    var key = selectStr;
    var val = selectFounder;
    var obj  = {};
    obj[key] = val;
    _this.setState(obj);

    var coach = getCoachFromName(_this, _this.state.selectCoach);
    var founder = getFounderFromName(_this, _this.state.selectFounder);
    var config = JSON.parse(_this.state.config);

    console.log("got founder and coach " + coach.name + " " + founder.name);

    if (coach != 0 && founder != 0){

        console.log("enter scoring function");
        _this.setState({ scoreCurrent: score(coach, founder, config)});
    }
}

function autcomp(data, _this,selectStr){
    return (
        <ReactAutocomplete
            items={data}
            shouldItemRender={(item, value) => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1}
            getItemValue={item => item.name}
            renderItem={(item, highlighted) =>
                <div
                    key={item.id}
                    style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}}
                >
                    {item.name}
                </div>
            }
            value={_this.state[selectStr]}

            onChange={e => inputChangeHandler(e.target.value, selectStr, _this)}
            onSelect={selectFounder => inputChangeHandler(selectFounder,selectStr, _this)}
        />
    )
}

export default autcomp;
