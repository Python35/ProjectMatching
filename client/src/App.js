import React, { Component } from 'react';

import { Navbar, Nav, NavItem, Button } from 'react-bootstrap';

import './App.css';
import table from "./components/datatable";
import {matchAlgo, score} from "./components/matching";
import autcomp from "./components/autcomp";
import {getFounderFromName, getCoachFromName} from "./components/helper";

const sw = require('stopword');


class App extends Component {
    state = {
        response: '',
        coaches: [""] ,
        founders: [""],
        matchings: [""],
        config: '',
        selectCoach: '',
        selectFounder: '',
        scoreCurrent: 0,
        dataFounders: '',
        dataCoaches: ''
    };

    componentDidMount() {
        this.callApi('/api/hello')
            .then(res => this.setState({ response: res.express }))
            .catch(err => console.log(err));
        this.callApi('/api/coaches')
            .then(res => this.setState({ coaches: res.express, dataCoaches: JSON.stringify(res.express) }))
            .catch(err => console.log(err));
        this.callApi('/api/founders')
            .then(res => this.setState({ founders: res.express, dataFounders: JSON.stringify(res.express) }))
            .catch(err => console.log(err));
        this.callApi('/api/config')
            .then(res => this.setState({ config: JSON.stringify(res.express) }))
            .catch(err => console.log(err));
    }

    callApi = async (queryStr) => {
        const response = await fetch(queryStr);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    handleConfigChange(evt){
        console.log(evt.target.value);
        this.setState({ config: evt.target.value });
    };

    handleDataFoundersChange(evt){
        this.setState({ dataFounders: evt.target.value });
    };

    handleDataCoachesChange(evt){
        this.setState({ dataCoaches: evt.target.value });
    };

    matching(){
        this.removeStopwords();
        var coaches = Array.from(this.state.coaches);
        var founders = Array.from(this.state.founders);
        var config = JSON.parse(this.state.config);

        let _this = this;
        _this.setState({ matchings: matchAlgo(coaches, founders, config)});
    };

    saveData(){
        console.log(this.state.coaches);
        var coaches = JSON.parse(this.state.dataCoaches);
        var founders = JSON.parse(this.state.dataFounders);
        console.log(coaches);
        let _this = this;
        _this.setState({ coaches : coaches, founders : founders });
    }

    removeStopwords(){
        var config = JSON.parse(this.state.config);
        var coaches = Array.from(this.state.coaches);
        var founders = Array.from(this.state.founders);
        var stopwordfields = Array.from(config.stopwordfields);

        var newcoaches = [];
        var newfounders =[];

        let _this = this;

        stopwordfields.forEach(function(stopwordfield){
            founders.forEach(function(founder){
                console.log(founder[stopwordfield]);
                founder[stopwordfield] = (sw.removeStopwords(founder[stopwordfield].toString().split(' '), sw.en.concat("want"))).toString().split(',');
                founder[stopwordfield] = (sw.removeStopwords(founder[stopwordfield].toString().split(' '), sw.de)).toString().split(',');
                newfounders.push(founder);
            });
            coaches.forEach(function(coach){
                console.log(coach[stopwordfield]);
                coach[stopwordfield] = (sw.removeStopwords(coach[stopwordfield].toString().split(' '), sw.en)).toString().split(',');
                coach[stopwordfield] = (sw.removeStopwords(coach[stopwordfield].toString().split(' '), sw.de)).toString().split(',');
                newcoaches.push(coach);
            });
        });
        _this.setState({ coaches : newcoaches, founders : newfounders });

    }

    score(){
        console.log("enter scoring");
        let _this = this;
        var coach = getCoachFromName(_this, this.state.selectCoach);
        var founder = getFounderFromName(_this, this.state.selectFounder);
        var config = JSON.parse(this.state.config);

        console.log("got founder and coach " + coach.name + " " + founder.name);

        if (coach != 0 && founder != 0){

            console.log("enter scoring function");
            _this.setState({ scoreCurrent: score(coach, founder, config)});
        }

    };

    render() {

        return (
            <div className="App">
                <Navbar inverse collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="#">Project Together Matching Platform</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            <NavItem eventKey={1} href="#">
                                Matching
                            </NavItem>
                            <NavItem eventKey={2} href="#">
                                Configuration
                            </NavItem>
                            <NavItem eventKey={3} href="#">
                                Testing
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <p>Coaches</p>
                { table(this.state.coaches,false)}

                <p>Founders</p>
                { table(this.state.founders, false)}

                <Button
                    bsStyle="primary"
                    onClick={(e) => this.matching()}
                > Match</Button>

                <Button
                    bsStyle="primary"
                    onClick={(e) => this.removeStopwords()}
                > Remove Common Words</Button>

                { table(this.state.matchings, false)}

                <p>Configuration</p>
                <textarea className="txtConfig" onChange={(e) => this.handleConfigChange(e)} value={this.state.config} />

                <p>1 on 1 Scoring</p>
                <p>Coach</p>
                { this.state.coaches.length>1 &&
                    autcomp(this.state.coaches, this , "selectCoach")
                }

                <p>Founder</p>
                { this.state.founders.length>1 &&
                    autcomp(this.state.founders, this , "selectFounder")
                }
                <p>Score</p>
                {this.state.scoreCurrent}

                <p>Data Founders</p>
                <textarea className="txtConfig" onChange={(e) => this.handleDataFoundersChange(e)} value={this.state.dataFounders} />


                <p>Data Coaches</p>
                <textarea className="txtConfig" onChange={(e) => this.handleDataCoachesChange(e)} value={this.state.dataCoaches} />
                <p></p>
                <Button
                    bsStyle="primary"
                    onClick={(e) => this.saveData()}
                > Save</Button>

            </div>
    );
    }
}
export default App;