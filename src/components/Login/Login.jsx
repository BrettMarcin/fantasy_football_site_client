import React from 'react';
import './Login.css';
import { Form, Button, Row, Col, Panel } from 'react-bootstrap';
import AuthService from '../AuthService'

class Login extends React.Component {
    constructor(){
        super();
        // this.handleChange = this.handleChange.bind(this);
        this.Auth = new AuthService();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitSignUp = this.handleSubmitSignUp.bind(this);
    }
    render() {
        return (
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <h1>Login</h1>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control placeholder="Enter username" />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
                <Col md={{ span: 6, offset: 3 }}>
                    <h1>Sign up</h1>
                    <Form onSubmit={this.handleSubmitSignUp}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control placeholder="Enter username" />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Name</Form.Label>
                            <Form.Control placeholder="Enter name" />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        );
    }

    handleSubmit(e){
        e.preventDefault();
        this.Auth.login(e.target[0].value,e.target[1].value)
            .then(res =>{
                window.location.reload();
            })
            .catch(err =>{
                alert(err);
            })
    }
    handleSubmitSignUp(e){
        e.preventDefault();
        var user = {
            "name" : e.target[2].value,
            "userName" : e.target[0].value,
            "password" : e.target[1].value,
            "email" : e.target[3].value,
            "roles" : [{
                "roleName" : "STANDARD_USER",
                "description" : "none"
            }]
        }
        this.Auth.signup(user)
            .then(res =>{
                window.location.reload();
            })
            .catch(err =>{
                alert(err);
            })
    }
}

export default Login;
