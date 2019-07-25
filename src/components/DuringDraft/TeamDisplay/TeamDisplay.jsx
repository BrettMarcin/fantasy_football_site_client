import React from 'react';
import './TeamDisplay.css';
import { Nav, Navbar } from 'react-bootstrap';
import Stomp from 'stompjs';
import SockJsClient from 'react-stomp';
import { Client } from '@stomp/stompjs';
import { animateScroll } from "react-scroll";
import { useReactTable } from 'react-table'
import { AgGridReact } from 'ag-grid-react';
import AuthService from '../../AuthService'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { DropdownButton,Dropdown,Table, ListGroup, Form, Button, Row, Col, Card, InputGroup, FormControl, Container, Jumbotron  } from 'react-bootstrap';

class SelectedPlayer extends React.Component {
    constructor(props) {
        super(props);
        // console.log(props)
        var teamSelected = ""
        this.Auth = new AuthService();
        if (props.prevState.user !== null || props.prevState.user !== undefined ) {
            teamSelected = props.prevState.user
        }

        var currentTeam = {
            QB: null,
            RB1: null,
            RB2: null,
            WR1: null,
            WR2: null,
            FLEX: null,
            TE: null,
            DST: null,
            K: null,
            bench: []
        }
        this.state = {
            teamDropdown : [],
            teamSelected : teamSelected,
            draftId : props.prevState.draftId,
            currentTeam : currentTeam,
            loadingPlayers: true
        };
        this.changeDropDownDefaut = this.changeDropDownDefaut.bind(this)//addPlayerToList
        this.addPlayerToList = this.addPlayerToList.bind(this)
        this.createTable = this.createTable.bind(this)
    }




    componentWillMount() {
        this.setState({loadingPlayers : true})
        this.Auth.getPlayersDuringDraft(this.state.draftId, this.state.teamSelected).then(res =>{
            var teamDropdown = []
            for (var i = 0; i < res.length; i++) {
                teamDropdown.unshift(
                    <Dropdown.Item onClick={this.changeDropDownDefaut} value={res[i]}>{res[i]}</Dropdown.Item>
                );
            }
            this.setState({teamDropdown : teamDropdown, loadingPlayers : false});
        }).catch(err =>{
            console.log('Could not get teams in draft')
        });

        this.Auth.getPlayersTeamDrafted(this.state.draftId, this.state.teamSelected).then(res =>{
            for (var i = 0; i < res.length; i++) {
                this.addPlayerToList(res[i])
            }
            this.setState({loadingPlayers : false})
        }).catch(err =>{
            console.log('Could not get teams in draft')
        });
        this.client = new Client();

        this.client.configure({
            brokerURL: 'ws://localhost:8000/draft-socket',
            onConnect: () => {
                this.client.subscribe('/draft/pickSelected/'+ this.state.draftId, message => {
                    var json = JSON.parse(message.body)
                    if (json.username === this.state.teamSelected) {
                        this.addPlayerToList(json.thePlayer)
                    }
                });
            },
        });
        this.client.activate();

    }

    addPlayerToList(player) {
        var theTeam = this.state.currentTeam;
        switch(player.postion) {
            case "QB":
                if (theTeam.QB === null) {
                    theTeam.QB = player
                } else {
                    theTeam.bench.push(player)
                }
                break;
            case "RB":
                if (theTeam.RB1 === null) {
                    theTeam.RB1 = player
                } else if(theTeam.RB2 === null){
                    theTeam.RB2 = player
                } else if(theTeam.FLEX === null) {
                    theTeam.FLEX = player
                } else {
                    theTeam.bench.push(player)
                }
                break;
            case "WR":
                if (theTeam.WR1 === null) {
                    theTeam.WR1 = player
                } else if(theTeam.WR2 === null){
                    theTeam.WR2 = player
                } else if(theTeam.FLEX === null) {
                    theTeam.FLEX = player
                } else {
                    theTeam.bench.push(player)
                }
                break;
            case "TE":
                if (theTeam.TE === null) {
                    theTeam.TE = player
                } else {
                    theTeam.bench.push(player)
                }
                break;
            case "DST":
                if (theTeam.DST === null) {
                    theTeam.DST = player
                } else {
                    theTeam.bench.push(player)
                }
                break;
            case "K":
                if (theTeam.K === null) {
                    theTeam.K = player
                } else {
                    theTeam.bench.push(player)
                }
                break;
        }
        this.setState({currentTeam : theTeam})
    }

    changeDropDownDefaut(e) {
        console.log(e.target.textContent)
        var currentTeam = {
            QB: null,
            RB1: null,
            RB2: null,
            WR1: null,
            WR2: null,
            FLEX: null,
            TE: null,
            DST: null,
            K: null,
            bench: []
        }
        this.setState({currentTeam : currentTeam, loadingPlayers : true, teamSelected: e.target.textContent})
        this.Auth.getPlayersTeamDrafted(this.state.draftId, e.target.textContent).then(res =>{
            for (var i = 0; i < res.length; i++) {
                this.addPlayerToList(res[i])
            }
            this.setState({loadingPlayers : false})
        }).catch(err =>{
            console.log('Could not get teams in draft')
        });
    }


    render() {
        if (this.state.loadingPlayers) {
            return (
                <div></div>
            )
        } else {
            var tableRows = this.createTable()
            // console.log(tableRows)
            return (
                <div>
                    <DropdownButton title={this.state.teamSelected}>
                        {this.state.teamDropdown}
                    </DropdownButton>
                    <Table striped bordered hover variant="dark">
                        <thead>
                        <tr>
                            <th></th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Team</th>
                            <th>rank</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableRows}
                        </tbody>
                    </Table>
                </div>
            )
        }

    }

    createTable() {
        var tableRows = []
        if (this.state.currentTeam.QB === null || this.state.currentTeam.QB === undefined) {
            tableRows.push(
                <tr>
                    <td>QB</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            )
        } else {
            tableRows.push(
                <tr>
                    <td>QB</td>
                    <td>{this.state.currentTeam.QB.firstName}</td>
                    <td>{this.state.currentTeam.QB.lastName}</td>
                    <td>{this.state.currentTeam.QB.team}</td>
                    <td>{this.state.currentTeam.QB.rank_player}</td>
                </tr>
            )
        }
        if (this.state.currentTeam.RB1 === null|| this.state.currentTeam.RB1 === undefined) {
            tableRows.push(
                <tr>
                    <td>RB1</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            )
        } else {
            tableRows.push(
                <tr>
                    <td>RB1</td>
                    <td>{this.state.currentTeam.RB1.firstName}</td>
                    <td>{this.state.currentTeam.RB1.lastName}</td>
                    <td>{this.state.currentTeam.RB1.team}</td>
                    <td>{this.state.currentTeam.RB1.rank_player}</td>
                </tr>
            )
        }
        if (this.state.currentTeam.RB2 === null|| this.state.currentTeam.RB2 === undefined) {
            tableRows.push(
                <tr>
                    <td>RB2</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            )
        } else {
            tableRows.push(
                <tr>
                    <td>RB2</td>
                    <td>{this.state.currentTeam.RB2.firstName}</td>
                    <td>{this.state.currentTeam.RB2.lastName}</td>
                    <td>{this.state.currentTeam.RB2.team}</td>
                    <td>{this.state.currentTeam.RB2.rank_player}</td>
                </tr>
            )
        }
        if (this.state.currentTeam.WR1 === null|| this.state.currentTeam.WR1 === undefined) {
            tableRows.push(
                <tr>
                    <td>WR1</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            )
        } else {
            tableRows.push(
                <tr>
                    <td>WR1</td>
                    <td>{this.state.currentTeam.WR1.firstName}</td>
                    <td>{this.state.currentTeam.WR1.lastName}</td>
                    <td>{this.state.currentTeam.WR1.team}</td>
                    <td>{this.state.currentTeam.WR1.rank_player}</td>
                </tr>
            )
        }
        if (this.state.currentTeam.WR2 === null|| this.state.currentTeam.WR2 === undefined) {
            tableRows.push(
                <tr>
                    <td>WR2</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            )
        } else {
            tableRows.push(
                <tr>
                    <td>WR2</td>
                    <td>{this.state.currentTeam.WR2.firstName}</td>
                    <td>{this.state.currentTeam.WR2.lastName}</td>
                    <td>{this.state.currentTeam.WR2.team}</td>
                    <td>{this.state.currentTeam.WR2.rank_player}</td>
                </tr>
            )
        }
        if (this.state.currentTeam.FLEX === null|| this.state.currentTeam.FLEX === undefined) {
            tableRows.push(
                <tr>
                    <td>FLEX</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            )
        } else {
            tableRows.push(
                <tr>
                    <td>FLEX</td>
                    <td>{this.state.currentTeam.FLEX.firstName}</td>
                    <td>{this.state.currentTeam.FLEX.lastName}</td>
                    <td>{this.state.currentTeam.FLEX.team}</td>
                    <td>{this.state.currentTeam.FLEX.rank_player}</td>
                </tr>
            )
        }
        if (this.state.currentTeam.TE === null|| this.state.currentTeam.TE === undefined) {
            tableRows.push(
                <tr>
                    <td>TE</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            )
        } else {
            tableRows.push(
                <tr>
                    <td>TE</td>
                    <td>{this.state.currentTeam.TE.firstName}</td>
                    <td>{this.state.currentTeam.TE.lastName}</td>
                    <td>{this.state.currentTeam.TE.team}</td>
                    <td>{this.state.currentTeam.TE.rank_player}</td>
                </tr>
            )
        }
        if (this.state.currentTeam.DST === null|| this.state.currentTeam.DST === undefined) {
            tableRows.push(
                <tr>
                    <td>DST</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            )
        } else {
            tableRows.push(
                <tr>
                    <td>DST</td>
                    <td>{this.state.currentTeam.DST.firstName}</td>
                    <td>{this.state.currentTeam.DST.lastName}</td>
                    <td>{this.state.currentTeam.DST.team}</td>
                    <td>{this.state.currentTeam.DST.rank_player}</td>
                </tr>
            )
        }
        if (this.state.currentTeam.K === null|| this.state.currentTeam.K === undefined) {
            tableRows.push(
                <tr>
                    <td>K</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            )
        } else {
            tableRows.push(
                <tr>
                    <td>K</td>
                    <td>{this.state.K.firstName}</td>
                    <td>{this.state.K.lastName}</td>
                    <td>{this.state.K.team}</td>
                    <td>{this.state.K.rank_player}</td>
                </tr>
            )
        }
        if (this.state.currentTeam.bench !== null && this.state.currentTeam.bench !== undefined) {
            for (var i = 0; i < this.state.currentTeam.bench.length; i++) {
                tableRows.push(
                    <tr>
                        <td>Bench</td>
                        <td>{this.state.currentTeam.bench[i].firstName}</td>
                        <td>{this.state.currentTeam.bench[i].lastName}</td>
                        <td>{this.state.currentTeam.bench[i].team}</td>
                        <td>{this.state.currentTeam.bench[i].rank_player}</td>
                    </tr>
                )
            }
        }
        return tableRows;
    }
}

export default SelectedPlayer;
