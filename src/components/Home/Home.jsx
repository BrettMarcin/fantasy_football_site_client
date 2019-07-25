import React from 'react';
import './Home.css';
import Login from '../Login/Login'
import { Form, Button, Row, Col, Card, InputGroup, FormControl, Container, Jumbotron } from 'react-bootstrap';
import AuthService from '../AuthService'

class Home extends React.Component {
    constructor(){
        super();
        // this.handleChange = this.handleChange.bind(this);
        this.Auth = new AuthService();
        this.isLoggedIn = this.isLoggedIn.bind(this)
        this.state = {
            publicDrafts : null,
            invitedDrafts : null,
            yourDrafts : null

        }
    }

    componentWillMount() {
        if (this.isLoggedIn()) {
            this.Auth.getDrafts().then(res =>{
                var publicDrafts = []
                var yourDrafts = []
                var invitedDrafts = []
                console.log("before add!3")
                for(var i=0;i<res.publicDrafts.length;i++){
                    // push the component to elements!
                    var string = '/draft/' + res.publicDrafts[i].id
                    var status;
                    if (res.publicDrafts[i].draftStarted  && res.publicDrafts[i].wasRunning === "running") {
                        status = "In Progress!"
                        publicDrafts.push(
                            <Card bg="success" text="white" style={{ width: '13rem' }}><Card.Body>
                                <Card.Title>The Draft: {res.publicDrafts[i].id} </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Created By: {res.publicDrafts[i].userCreated.userName}</Card.Subtitle>
                                <Card.Text>Status: {status}</Card.Text>
                                <Card.Link href={string}>Link to draft</Card.Link>
                            </Card.Body>
                            </Card>
                        );
                    } else if(res.publicDrafts[i].draftStarted && res.publicDrafts[i].wasRunning === "paused") {
                        status = "Is paused"
                        publicDrafts.push(
                            <Card bg="warning" text="white" style={{ width: '13rem' }}><Card.Body>
                                <Card.Title>The Draft: {res.publicDrafts[i].id} </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Created By: {res.yourDrafts[i].userCreated.userName}</Card.Subtitle>
                                <Card.Text>Status: {status}</Card.Text>
                                <Card.Link href={string}>Link to draft</Card.Link>
                            </Card.Body>
                            </Card>
                        );
                    } else if (res.publicDrafts[i].draftStarted && res.publicDrafts[i].wasRunning === "end"){
                        status = "Ended"
                        publicDrafts.push(
                            <Card bg="danger" text="white" style={{ width: '13rem' }}><Card.Body>
                                <Card.Title>The Draft: {res.publicDrafts[i].id} </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Created By: {res.publicDrafts[i].userCreated.userName}</Card.Subtitle>
                                <Card.Text>Status: {status}</Card.Text>
                                <Card.Link href={string}>Link to draft</Card.Link>
                            </Card.Body>
                            </Card>
                        );
                    } else {
                        status = "Has Not started"
                        publicDrafts.push(
                            <Card bg="dark" text="white" style={{ width: '13rem' }}><Card.Body>
                                <Card.Title>The Draft: {res.publicDrafts[i].id} </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Created By: {res.publicDrafts[i].userCreated.userName}</Card.Subtitle>
                                <Card.Text>Status: {status}</Card.Text>
                                <Card.Link href={string}>Link to draft</Card.Link>
                            </Card.Body>
                            </Card>
                        );
                    }
                    // publicDrafts.push(<Card value={ res.publicDrafts[i].isPublic } />);

                }

                for(var i=0;i<res.yourDrafts.length;i++){
                    // push the component to elements!
                    var string = '/draft/' + res.yourDrafts[i].id
                    var status;
                    if (res.yourDrafts[i].draftStarted && res.yourDrafts[i].wasRunning === "running") {
                        status = "In Progress!"
                        yourDrafts.push(
                            <Card bg="success" text="white" style={{ width: '13rem' }}><Card.Body>
                                <Card.Title>The Draft: {res.yourDrafts[i].id} </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Created By: {res.yourDrafts[i].userCreated.userName}</Card.Subtitle>
                                <Card.Text>Status: {status}</Card.Text>
                                <Card.Link href={string}>Link to draft</Card.Link>
                            </Card.Body>
                            </Card>
                        );
                    } else if(res.yourDrafts[i].draftStarted && res.yourDrafts[i].wasRunning === "paused") {
                        status = "Is paused"
                        yourDrafts.push(
                            <Card bg="warning" text="white" style={{ width: '13rem' }}><Card.Body>
                                <Card.Title>The Draft: {res.yourDrafts[i].id} </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Created By: {res.yourDrafts[i].userCreated.userName}</Card.Subtitle>
                                <Card.Text>Status: {status}</Card.Text>
                                <Card.Link href={string}>Link to draft</Card.Link>
                            </Card.Body>
                            </Card>
                        );
                    } else if (res.yourDrafts[i].draftStarted && res.yourDrafts[i].wasRunning === "end"){
                        status = "ended"
                        yourDrafts.push(
                            <Card bg="danger" text="white" style={{ width: '13rem' }}><Card.Body>
                                <Card.Title>The Draft: {res.yourDrafts[i].id} </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Created By: {res.yourDrafts[i].userCreated.userName}</Card.Subtitle>
                                <Card.Text>Status: {status}</Card.Text>
                                <Card.Link href={string}>Link to draft</Card.Link>
                            </Card.Body>
                            </Card>
                        );
                    }else {
                        status = "Has Not started"
                        yourDrafts.push(
                            <Card bg="dark" text="white" style={{ width: '13rem' }}><Card.Body>
                                <Card.Title>The Draft: {res.yourDrafts[i].id} </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Created By: {res.yourDrafts[i].userCreated.userName}</Card.Subtitle>
                                <Card.Text>Status: {status}</Card.Text>
                                <Card.Link href={string}>Link to draft</Card.Link>
                            </Card.Body>
                            </Card>
                        );
                    }
                }

                // Invite user card!!!!!!!!!
                for(var i=0;i<res.invitedDrafts.length;i++){
                    var string = '/draft/' + res.invitedDrafts[i].id
                    var status;
                    if (res.invitedDrafts[i].draftStarted && res.invitedDrafts[i].wasRunning === "running") {
                        status = "In Progress!"
                        invitedDrafts.push(
                            <Card bg="success" text="white" style={{ width: '13rem' }}><Card.Body>
                                <Card.Title>The Draft: {res.invitedDrafts[i].id} </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Created By: {res.invitedDrafts[i].userCreated.userName}</Card.Subtitle>
                                <Card.Text>Status: {status}</Card.Text>
                                <Card.Link href={string}>Link to draft</Card.Link>
                            </Card.Body>
                            </Card>
                        );
                    } else if(res.invitedDrafts[i].draftStarted && res.invitedDrafts[i].wasRunning === "paused") {
                        status = "Is paused"
                        invitedDrafts.push(
                            <Card bg="warning" text="white" style={{ width: '13rem' }}><Card.Body>
                                <Card.Title>The Draft: {res.invitedDrafts[i].id} </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Created By: {res.invitedDrafts[i].userCreated.userName}</Card.Subtitle>
                                <Card.Text>Status: {status}</Card.Text>
                                <Card.Link href={string}>Link to draft</Card.Link>
                            </Card.Body>
                            </Card>
                        );
                    } else if(res.invitedDrafts[i].draftStarted && res.invitedDrafts[i].wasRunning === "end") {
                        status = "end"
                        invitedDrafts.push(
                            <Card bg="danger" text="white" style={{ width: '13rem' }}><Card.Body>
                                <Card.Title>The Draft: {res.invitedDrafts[i].id} </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Created By: {res.invitedDrafts[i].userCreated.userName}</Card.Subtitle>
                                <Card.Text>Status: {status}</Card.Text>
                                <Card.Link href={string}>Link to draft</Card.Link>
                            </Card.Body>
                            </Card>
                        );
                    }else {

                        status = "Has Not started"
                        invitedDrafts.push(
                            <Card bg="dark" text="white" style={{ width: '13rem' }}><Card.Body>
                                <Card.Title>The Draft: {res.invitedDrafts[i].id} </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Created By: {res.invitedDrafts[i].userCreated.userName}</Card.Subtitle>
                                <Card.Text>Status: {status}</Card.Text>
                                <Card.Link href={string}>Link to draft</Card.Link>
                            </Card.Body>
                            </Card>
                        );
                    }

                }
                this.setState({ publicDrafts : publicDrafts, invitedDrafts : invitedDrafts, yourDrafts : yourDrafts })
            }).catch(err =>{
                console.log('Could not fetch profile')
            });
        }
    }

    isLoggedIn() {
        return this.Auth.loggedIn()
    }

    render() {
        if (!this.isLoggedIn()) {
            return (
                <div>
                    <Container>
                        <Login isLoggedIn={true}/>
                    </Container>
                </div>
            );
        } else {
            return (
                <div>
                    <Row><Col md={{ span: 6}} md-offset="">
                    <Jumbotron fluid>
                        <Container>
                            <h1>Drafts</h1>
                        </Container>
                        </Jumbotron>
                    </Col>
                    </Row>
                    <Row>
                        <Col md={{ span: 3}}>
                            <h2>Public Drafts</h2>
                            {this.state.publicDrafts} </Col>
                        <Col md={{ span: 3}}>
                            <h2>Your Drafts</h2>
                            {this.state.yourDrafts} </Col>
                        <Col md={{ span: 3}}>
                            <h2>Invited Drafts</h2>
                            {this.state.invitedDrafts} </Col>
                    </Row>
                </div>
            );
        }
    }
}

export default Home;
