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
    }
    render() {
        return (
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <h1>Login</h1>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control placeholder="Enter email" />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <Form.Group controlId="formBasicChecbox">
                            <Form.Check type="checkbox" label="Check me out" />
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
}

export default Login;
