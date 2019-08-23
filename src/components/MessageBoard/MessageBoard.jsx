import React from 'react';
import './MessageBoard.css';
import { Nav, Navbar } from 'react-bootstrap';
import AuthService from '../AuthService'
import Stomp from 'stompjs';
import SockJsClient from 'react-stomp';
import { Client } from '@stomp/stompjs';
import { animateScroll } from "react-scroll";
import { Table, ListGroup, Form, Button, Row, Col, Card, InputGroup, FormControl, Container, Jumbotron  } from 'react-bootstrap';

class MessageBoard extends React.Component {
    constructor(props) {
        super(props);
        this.Auth = new AuthService();
        this.state = {
            messages : [],
            newMessage : 0,
            draftId : props.prevState.draftInfo.id,
            user : props.prevState,
            input : null

        };
        this.handleChange = this.handleChange.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
    }

    // sendMessage = (msg) => {
    //     this.clientRef.sendMessage('/api/draft/chat/' + this.state.draftId, msg);
    // }

    componentWillMount() {
        this.client = new Client();

        this.client.configure({
            brokerURL: 'wss://'+ process.env.REACT_APP_STAGE +'/draft-socket',
            onConnect: () => {
                // this.client.subscribe('/queue/now', message => {
                //     console.log(message);
                //     this.setState({serverTime: message.body});
                // });

                this.client.subscribe('/draft/chatRoom/'+ this.state.draftId, message => {
                    var json = JSON.parse(message.body)
                    var messages = this.state.messages
                    messages.push(
                        <ListGroup.Item>{json.from}: {json.text}</ListGroup.Item>
                    );
                    this.setState({messages : messages});
                });
            },
        });

        this.client.activate();
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({input: e.target.value});
    }


    clickHandler = () => {
        var json = {
            "from" : this.state.user.user,
            "text" : this.state.input
        }
        this.setState({input: ''});
        this.client.publish({destination: '/api/chat/' + this.state.draftId, body: JSON.stringify(json)});
    }

    render() {
        return (
            <Col md={{ span: 6}}>
                <Card style={{ width: '50rem' }}>
                    <ListGroup variant="flush"  id="message-board">
                        {this.state.messages}
                    </ListGroup>
                </Card>
                <InputGroup className="mb-4">
                    <FormControl
                        value={this.state.input}
                        placeholder="Message"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        onChange={ this.handleChange }
                    />
                    <InputGroup.Append>
                        <Button variant="outline-secondary" onClick={this.clickHandler}>Button</Button>
                    </InputGroup.Append>
                </InputGroup>
            </Col>
        )
    }
}

export default MessageBoard;
