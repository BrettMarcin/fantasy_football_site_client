import React from 'react';
import './CreateDraft.css';
import PropTypes from 'prop-types';
import AuthService from '../AuthService';
import {Typeahead, Fragment} from 'react-bootstrap-typeahead';
import { Redirect } from 'react-router-dom';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Form, Button, Row, Col, Card, InputGroup, FormControl } from 'react-bootstrap';

class CreateDraft extends React.Component {
    constructor(){
        super();
        // this.handleChange = this.handleChange.bind(this);
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.state = {
            usernames : [],
            isLoggedIn : false,
            selectedUser : [],
            isPublic : false,
            buttonPressed : false
        };
    }

    componentWillMount() {
        this.setState({isLoggedIn :  this.Auth.loggedIn()});
        if (this.Auth.loggedIn()) {
            this.Auth.getUserNames().then(res =>{
                this.setState({ usernames : res.users })
            }).catch(err =>{
                console.log('Could not get userNames')
            });
        }
    }

    handleCheckboxChange() {
        this.setState({ isPublic : !this.state.isPublic })
    }

    handleChange(selectedOptions) {
        this.setState({selectedUser : selectedOptions});
    }

    render() {
        if (!this.state.isLoggedIn || this.state.buttonPressed) {
            return  <Redirect to="/" />
        }
        return (
            <div>
                <Row>
                    <Col md={{ span: 6, offset: 5 }}>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                    <h1>Create Draft</h1>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Group controlId="usersInvited">
                                        <React.Fragment>
                                            <Typeahead
                                                labelKey="name"
                                                multiple={true}
                                                options={this.state.usernames}
                                                placeholder="Choose users to invite"
                                                onChange={this.handleChange}
                                            />
                                        </React.Fragment>
                                    </Form.Group>
                                    <Form.Group controlId="isPublic">
                                        <InputGroup className="mb-3">
                                            <InputGroup.Prepend onChange={this.handleCheckboxChange}>
                                                <InputGroup.Checkbox aria-label="Checkbox for following text input" />
                                                <InputGroup.Text>is public</InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <FormControl aria-label="Text input with checkbox" />
                                        </InputGroup>
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        Submit
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }

    handleSubmit(e){
        e.preventDefault();
        var json = {
            "isPublic" : this.state.isPublic,
            "usersInvited" : this.state.selectedUser
        }
        this.Auth.createDraft(json).then(res =>{
            this.setState({buttonPressed : true});
        });

    }
}

export default CreateDraft;
