import React from 'react';
import './Draft.css';
import PropTypes from 'prop-types';
import AuthService from '../AuthService';
import {Typeahead, Fragment} from 'react-bootstrap-typeahead';
import { Redirect } from 'react-router-dom';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import BeforeDraft from '../BeforeDraft/BeforeDraft'
import DuringDraft from '../DuringDraft/DuringDraft'
import EndDraft from '../EndDraft/EndDraft'
import { Client } from '@stomp/stompjs';
import { Form, Button, Row, Col, Card, InputGroup, FormControl } from 'react-bootstrap';

class Draft extends React.Component {
    constructor(){
        super();
        this.Auth = new AuthService();
        this.state = {
            draftInfo: null,
            loading: true,
            loadingUser : true,
            user: null
        };
        this.isLoggedIn = this.isLoggedIn.bind(this)
    }

    componentWillMount() {
        this.setState({loading :  true, loadingUser : true})
        this.Auth.getDraftInfo(this.props.match.params.id).then(res =>{
            this.setState({ draftInfo : res,   loading :  false})
            if (res !== null && res !== undefined) {
                this.client = new Client();
                this.client.configure({
                    brokerURL: 'wss://'+ process.env.REACT_APP_STAGE +'/draft-socket',
                    onConnect: () => {
                        this.client.subscribe('/draft/hasDraftEnded/'+this.props.match.params.id, message => {
                            var draftInfo = res
                            draftInfo.wasRunning = "end"
                            this.setState({draftInfo : draftInfo});
                        });
                    },
                });
                this.client.activate();
            }
        }).catch(err =>{
            console.log('Could not get userNames')
            this.setState({ loading :  false })
        });
        if (this.isLoggedIn()) {
            this.Auth.getProfile().then(res =>{
                this.setState({ user : res.name, loadingUser : false })
            }).catch(err =>{
                console.log('Could not fetch profile')
            });
        } ///draft/hasDraftEnded/
    }

    isLoggedIn() {
        return this.Auth.loggedIn()
    }

    render() {
        if (this.state.loadingUser === false && this.state.loading === false && this.state.draftInfo === null) {
            return  <Redirect to="/"/>
        }
        if ( this.state.loadingUser === false && this.state.loading === false && this.state.draftInfo !== null && (this.state.draftInfo.wasRunning === "no" || this.state.draftInfo.wasRunning === "paused") ) {
            return (
                    <BeforeDraft prevState={this.state}/>
            );
        }
        if (this.state.loadingUser === false && this.state.loading === false && this.state.draftInfo !== null && this.state.draftInfo.wasRunning === "running") {
            return (
                    <DuringDraft prevState={this.state}/>
            );
        }

        if (this.state.loadingUser === false && this.state.loading === false && this.state.draftInfo !== null && this.state.draftInfo.wasRunning === "end") {
            return (
                <EndDraft prevState={this.state}/>
            );
        }
        return (
            <div>

            </div>
        );
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

export default Draft;
