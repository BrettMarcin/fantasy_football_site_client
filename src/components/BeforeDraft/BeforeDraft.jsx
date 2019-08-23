import React from 'react';
import './BeforeDraft.css';
import PropTypes from 'prop-types';
import AuthService from '../AuthService';
import {Typeahead, Fragment} from 'react-bootstrap-typeahead';
import { Redirect } from 'react-router-dom';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import MessageBoard from '../MessageBoard/MessageBoard'
import JoinDraft from './JoinDraft/JoinDraft'
import StartDraftButton from './StartDraftButton/StartDraftButton'
import DeleteDraftButton from './DeleteDraftButton/DeleteDraftButton'
import { Client } from '@stomp/stompjs';
// import {MessageBoard} from './MessageBoard/MessageBoard'
import { Form, Button, Row, Col, Card, InputGroup, FormControl, Container, Jumbotron  } from 'react-bootstrap';

class BeforeDraft extends React.Component {
    constructor(props){
        super(props);
        // this.handleChange = this.handleChange.bind(this);
        this.Auth = new AuthService();
        // this.handleChange = this.handleChange.bind(this)
        // this.handleSubmit = this.handleSubmit.bind(this)
        // this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.state = {
            draftInfo: this.props.prevState.draftInfo,
            invitedUsersCard : null,
            acceptedCard : null,
            invitedUsers : null,
            accepted : null,
            user :  this.props.prevState.user,
            loading : true
        };
    }

    componentWillMount() {
        this.setState({isLoggedIn :  this.Auth.loggedIn(), loading : true});
        this.Auth.getUsersInDraft(this.state.draftInfo.id).then(res =>{
            var invitedUsersCard = []
            var acceptedCard = []
            for(var i=0;i<res.usersInvited.length;i++){
                invitedUsersCard.push(
                    <Card style={{ width: '13rem' }}><Card.Body>
                        <Card.Title>{res.usersInvited[i]} </Card.Title>
                    </Card.Body>
                    </Card>
                );
            }
            for(var i=0;i<res.usersAccepted.length;i++){
                acceptedCard.push(
                    <Card style={{ width: '13rem' }}><Card.Body>
                        <Card.Title>{res.usersAccepted[i]}</Card.Title>
                    </Card.Body>
                    </Card>
                );
            }
            this.setState({invitedUsersCard : invitedUsersCard, acceptedCard :  acceptedCard, loading : false, invitedUsers : res.usersInvited, accepted : res.usersAccepted});
        }).catch(err =>{

            console.log('Could not get the users for this draft')
        });
        this.client = new Client();

        this.client.configure({
            brokerURL: 'ws://'+ process.env.REACT_APP_STAGE +'/draft-socket',
            onConnect: () => {
                this.client.subscribe('/draft/draftStarted/'+ this.state.draftInfo.id, message => {
                    window.location.reload();
                });
            },
        });

        this.client.activate();
    }

    render() {
        if (!this.state.loading) {
            return (
                <div>
                    <Row><Col md={{ span: 6}} md-offset="">
                        <Jumbotron fluid>
                            <Container>
                                <h1>Draft {this.state.draftInfo.id}</h1>
                            </Container>
                        </Jumbotron>
                        {<DeleteDraftButton prevState={this.state} />}
                    </Col>
                        <Col md={{ span: 3}} md-offset="">
                            {<JoinDraft prevState={this.state} />}
                            {<StartDraftButton prevState={this.state} />}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{ span: 3}}>
                            <h2>Invited</h2>
                            {this.state.invitedUsersCard} </Col>
                        <Col md={{ span: 3}}>
                            <h2>Accepted</h2>
                            {this.state.acceptedCard} </Col>
                    </Row>
                    <Row>
                        <MessageBoard prevState={this.state}/>
                    </Row>
                </div>
            );
        } else {
            return (
                <div></div>
            )
        }
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

export default BeforeDraft;
