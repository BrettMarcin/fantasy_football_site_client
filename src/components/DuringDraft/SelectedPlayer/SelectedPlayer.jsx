import React from 'react';
import './SelectedPlayer.css';
import { Nav, Navbar } from 'react-bootstrap';
import Stomp from 'stompjs';
import SockJsClient from 'react-stomp';
import { Client } from '@stomp/stompjs';
import { animateScroll } from "react-scroll";
import { useReactTable } from 'react-table'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Table, ListGroup, Form, Button, Row, Col, Card, InputGroup, FormControl, Container, Jumbotron  } from 'react-bootstrap';

class SelectedPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerSelected : props.playerSelected
        };
    }


    componentWillReceiveProps(props) {
        this.setState({ playerSelected: props.playerSelected })
    }


    render() {
        if (this.state.playerSelected === null || this.state.playerSelected === undefined) {
            return (
                <Card style={{ width: '11rem', height: '82px' }}>
                    <Card.Body>
                        <p style={{fontSize: '12px'}}>Player Selected:</p>
                        <p style={{fontSize: '14px'}}></p>
                    </Card.Body>
                </Card>
            )
        } else {
            return (
                <Card style={{ width: '11rem', height: '82px' }}>
                    <Card.Body>
                        <p style={{fontSize: '12px'}}>Player Selected:</p>
                        <p style={{fontSize: '14px'}}>{this.state.playerSelected.firstName} {this.state.playerSelected.lastName}</p>
                    </Card.Body>
                </Card>
            )
        }

    }
}

export default SelectedPlayer;
