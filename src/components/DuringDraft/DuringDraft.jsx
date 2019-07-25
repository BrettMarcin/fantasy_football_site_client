import React from 'react';
import './DuringDraft.css';
import PropTypes from 'prop-types';
import AuthService from '../AuthService';
import {Typeahead, Fragment} from 'react-bootstrap-typeahead';
import { Redirect } from 'react-router-dom';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Client } from '@stomp/stompjs';
import PlayerDraft from './PlayerDraft/PlayerDraft'
import SelectedPlayer from './SelectedPlayer/SelectedPlayer'
import PlayerHistory from './PlayerHistory/PlayerHistory'
import TeamDisplay from './TeamDisplay/TeamDisplay'
import { Table, ListGroup, Form, Button, Row, Col, Card, InputGroup, FormControl, Container, Jumbotron  } from 'react-bootstrap';

class DuringDraft extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            time : 0,
            draftId: props.prevState.draftInfo.id,
            picks : null,
            playerSelected: null,
            buttonDisable : true,
            user : props.prevState.user,
            originalPicks : null,
            pickHistory : null,
            lastPick: null
        };
        this.Auth = new AuthService();
        this.msToTime = this.msToTime.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.onClick.bind(this)
        this.checkIfUserPick = this.checkIfUserPick.bind(this)
    }

    componentWillMount() {
        this.client = new Client();

        this.client.configure({
            brokerURL: 'ws://localhost:8000/draft-socket',
            onConnect: () => {
                this.client.subscribe('/draft/timer/'+ this.state.draftId, message => {
                    var json = JSON.parse(message.body)
                    var messages = json.theTime
                    this.setState({time : this.msToTime(messages)});
                });
                this.client.subscribe('/draft/pickSelected/'+ this.state.draftId, message => {
                    var json = JSON.parse(message.body)
                    this.state.picks.shift()
                    this.state.originalPicks.shift()
                    this.setState({picks : this.state.picks, originalPicks : this.state.originalPicks, lastPick : json});
                });
            },
        });

        this.Auth.getRemainingPicks(this.state.draftId).then(res =>{
            var thePicks = []
            for (var i = 0; i < res.length; i++) {
                thePicks.push(
                    <ListGroup.Item className="pick-item">
                        {res[i].username}: {res[i].pickNumber}
                    </ListGroup.Item>
                );
            }
            var disableButton = true
            if (res != null && res.length > 0 && res[0].username === this.state.user) {
                disableButton = false
            }
            this.setState({picks : thePicks, originalPicks : res, buttonDisable: disableButton});
        }).catch(err =>{
            console.log('Could not get picks')
        });
        
        this.client.activate();
    }

    msToTime(duration) {
        var milliseconds = parseInt((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        if ((60-seconds) < 10) {
            return (1-minutes) + ":0" + (60-seconds);
        }
        return (1-minutes) + ":" + (60-seconds);
    }

    handleChange(player) {
        this.setState({playerSelected : player[0]});
    }

    // TODO: finish
    checkIfUserPick() {
        if (this.state.user !== null && this.state.user !== undefined && this.state.originalPicks !== null && this.state.originalPicks.length > 0 && this.state.originalPicks[0].username === this.state.user) {
            return false;
        }
        return true;
    }

    onClick() {
        var pick = this.state.originalPicks[0];
        pick.thePlayer = this.state.playerSelected;
        pick.draftId = this.state.draftId;
        this.setState({playerSelected : null});
        this.Auth.pickPlayer(this.state.draftId, pick).then(res =>{
        }).catch(err =>{
            console.log('Could send pick')
        });
    }

    render() {
        var playerHistoryObject = {draftId: this.state.draftId, lastPick : this.state.lastPick}
        return (
            <Container>
            <Row noGutters="true">
                <Col md={1}>
                    <Card style={{ width: '6rem' }}>
                        <Card.Body>
                            <h4>{this.state.time}</h4>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={7}>
                <Card style={{ width: '40rem' }}>
                    <ListGroup variant="flush"  id="timeline">
                        {this.state.picks}
                    </ListGroup>
                </Card>
                </Col>
                <Col md={2}>
                    <SelectedPlayer playerSelected={this.state.playerSelected}/>
                </Col>
                <Col md={1}>
                    <Button variant="primary" size="lg" disabled={this.checkIfUserPick()} onClick={this.handleClick}>
                        Draft Player
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 8}}>
                    <PlayerDraft prevState={this.state} handleChange={this.handleChange}/>
                </Col>
                <Col md={{ span: 3}}>
                    <PlayerHistory prevState={playerHistoryObject}/>
                </Col>
            </Row>
                <Row>
                    <Col md={{ span: 3}}>
                        <TeamDisplay prevState={this.state}/>
                    </Col>
                </Row>
            </Container>

        )
    }

    // handleSubmit(e){
    //     e.preventDefault();
    //     var json = {
    //         "isPublic" : this.state.isPublic,
    //         "usersInvited" : this.state.usernames
    //     }
    //     this.Auth.createDraft(json).then(res =>{
    //
    //     });
    //     this.setState({buttonPressed : true});
    //
    // }
}

export default DuringDraft;
