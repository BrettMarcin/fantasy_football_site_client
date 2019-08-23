import React from 'react';
import './PlayerHistory.css';
import { Nav, Navbar } from 'react-bootstrap';
import AuthService from '../../AuthService'
import Stomp from 'stompjs';
import SockJsClient from 'react-stomp';
import { Client } from '@stomp/stompjs';
import { animateScroll } from "react-scroll";
import { useReactTable } from 'react-table'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Table, ListGroup, Form, Button, Row, Col, Card, InputGroup, FormControl, Container, Jumbotron  } from 'react-bootstrap';

class PlayerHistory extends React.Component {
    constructor(props) {
        super(props);
        this.Auth = new AuthService();
        this.state = {
            pickHistory : [],
            draftId : props.prevState.draftId
        };
    }


    // componentWillReceiveProps(newProps) {
    //     if (newProps !== undefined && newProps.prevState.lastPick !== null && newProps.prevState.lastPick !== undefined && this.props.lastPick !== newProps.prevState.lastPick) {
    //         var pickHistory = this.state.pickHistory
    //         console.log('Not the same!')
    //         console.log(newProps)
    //
    //         pickHistory.push(
    //             <ListGroup.Item className="player-history-group">
    //                 <p className="player-history-item"><b>round:</b> {newProps.prevState.lastPick.round} <b>pick:</b> {newProps.prevState.lastPick.pickNumber}</p>
    //                 <p className="player-history-item"><b>Draft By:</b> {newProps.prevState.lastPick.username}</p>
    //                 <p className="player-history-item"><b>Player:</b> {newProps.prevState.lastPick.thePlayer.firstName} {newProps.prevState.lastPick.thePlayer.lastName}</p>
    //             </ListGroup.Item>
    //         );
    //         this.setState({ pickHistory: pickHistory })
    //     }
    //
    // }

    componentWillMount() {
        this.Auth.getPickHistory(this.state.draftId).then(res =>{
            var pickHistory = []
            for (var i = 0; i < res.length; i++) {
                pickHistory.push(
                    <ListGroup.Item className="player-history-group">
                        <p className="player-history-item"><b>round:</b> {res[i].round} <b>pick:</b> {res[i].pickNumber}</p>
                        <p className="player-history-item"><b>Draft By:</b> {res[i].username}</p>
                        <p className="player-history-item"><b>Player:</b> {res[i].thePlayer.firstName} {res[i].thePlayer.lastName}</p>
                    </ListGroup.Item>
                );
            }
            this.setState({pickHistory : pickHistory});
        }).catch(err =>{
            console.log('Could not get history of players')
        });

        // TODO: need to do in a better way
        this.client = new Client();

        this.client.configure({
            brokerURL: 'wss://'+ process.env.REACT_APP_STAGE +'/draft-socket',
            onConnect: () => {
                this.client.subscribe('/draft/pickSelected/'+ this.state.draftId, message => {
                    var json = JSON.parse(message.body)
                    var pickHistory = this.state.pickHistory
                    pickHistory.unshift(
                        <ListGroup.Item className="player-history-group">
                            <p className="player-history-item"><b>round:</b> {json.round} <b>pick:</b> {json.pickNumber}</p>
                            <p className="player-history-item"><b>Draft By:</b> {json.username}</p>
                            <p className="player-history-item"><b>Player:</b> {json.thePlayer.firstName} {json.thePlayer.lastName}</p>
                        </ListGroup.Item>
                    );
                    this.setState({ pickHistory: pickHistory })
                });
            },
        });
        this.client.activate();
    }




    render() {
        return (
            <Card style={{ width: '15rem', height: '10rem'}}>
                <ListGroup variant="flush"  id="player-history">
                    {this.state.pickHistory}
                </ListGroup>
            </Card>
        )
    }
}

export default PlayerHistory;
