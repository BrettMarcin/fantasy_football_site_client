import React from 'react';
import './PlayerDraft.css';
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

class PlayerDraft extends React.Component {
    constructor(props) {
        super(props);
        this.Auth = new AuthService();
        this.state = {
            draftId : props.prevState.draftId,
            players : null
        };
        this.handleClick= this.handleClick.bind(this);
        this.handleChange = this.props.handleChange
        // this.clickHandler = this.clickHandler.bind(this);
    }

    // sendMessage = (msg) => {
    //     this.clientRef.sendMessage('/api/draft/chat/' + this.state.draftId, msg);
    // }

    componentWillMount() {
        this.Auth.getPlayersRemaining(this.state.draftId).then(res =>{
            // var thePicks = []
            this.setState({players : res});
        }).catch(err =>{
            console.log('Could not get players')
        });
        this.client = new Client();

        this.client.configure({
            brokerURL: 'ws://localhost:8000/draft-socket',
            onConnect: () => {
                this.client.subscribe('/draft/pickSelected/'+ this.state.draftId, message => {
                    var json = JSON.parse(message.body)
                    //var selectedData = this.gridApi.getSelectedRows();
                    // console.log(json.thePlayer)
                    var playerArray = []
                    for (var i = 0; i < this.state.players.length; i++) {
                        if(json.thePlayer.id === this.state.players[i].id) {
                            playerArray.push(this.state.players[i])
                            continue;
                        }
                    }
                    var res = this.gridApi.updateRowData({ remove: playerArray });
                    // this.setState({players : tablePicks});
                });
            },
        });

        this.client.activate();
    }

    onGridReady = params => {
        this.gridApi = params.api;
    }

    handleClick(e) {
        var selectedRows = this.gridApi.getSelectedRows();
        this.handleChange(selectedRows)
    }

    render() {
        var columnDefs = [{
            headerName: "rank", field: "rank_player", sortable: true, filter: true, width: 68
        }, {
            headerName: "first name", field: "firstName", sortable: true, filter: true, width: 125
        }, {
            headerName: "last name", field: "lastName", sortable: true, filter: true, width: 125
        },{
            headerName: "team", field: "team", sortable: true, filter: true, width: 72
        }, {
            headerName: "total pts", field: "totalPts", sortable: true, filter: true,  width: 95
        }, {
            headerName: "games played", field: "gamesPlayed", sortable: true, filter: true,  width: 124
        },{
            headerName: "rushing yds", field: "rushYards", sortable: true, filter: true,  width: 113
        }, {
            headerName: "rushing TDS", field: "rushTds", sortable: true, filter: true,  width: 115
        }, {
            headerName: "passing yds", field: "passYards", sortable: true, filter: true,  width: 113
        },{
            headerName: "passing TDS", field: "passTds", sortable: true, filter: true, width: 117
        }, {
            headerName: "fumbles", field: "fumbles", sortable: true, filter: true, width: 90
        }, {
            headerName: "interceptions", field: "interceptions", sortable: true, filter: true, width: 117
        },{
            headerName: "position", field: "postion", sortable: true, filter: true, width: 90
        }, {
            headerName: "receiving yds", field: "recYards", sortable: true, filter: true,  width: 124
        }, {
            headerName: "receptions", field: "rec", sortable: true, filter: true, width: 117
        }]


        var column = { resizable: true}
        return (
            <div
                className="ag-theme-balham"
                style={{
            height: '500px',
            width: '750px' }}
                rowSelecton="single"
            >
                <AgGridReact
                    onGridReady={this.onGridReady}
                    columnDefs={columnDefs}
                    rowData={this.state.players}
                    rowSelection='single'
                    onSelectionChanged={this.handleClick.bind(this)}
                    >
                </AgGridReact>
            </div>
        )
    }
}

export default PlayerDraft;
