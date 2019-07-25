import React from 'react';
import './NavBar.css';
import { Nav, Navbar, Button,  Badge, Dropdown, DropdownButton} from 'react-bootstrap';
import AuthService from '../AuthService'
import  { Redirect } from 'react-router-dom'

class NavBar extends React.Component {
    constructor() {
        super();
        this.Auth = new AuthService();
        this.isLoggedIn = this.isLoggedIn.bind(this)
        this.onClick = this.onClick.bind(this)
        this.JoinDraft = this.JoinDraft.bind(this)
        this.deleteNotfication = this.deleteNotfication.bind(this)
        this.state = {
            profile : null,
            notificationNumber : 0,
            notificationList : [],
            gotList : false,
            showNotificationList: false,
            listOfNotificationObjects : []
        };
    }

    componentWillMount() {
        if (this.isLoggedIn()) {
            this.Auth.getProfile().then(res =>{
                this.setState({ profile : res.name })
            }).catch(err =>{
                console.log('Could not fetch profile')
            });

            this.Auth.getNumberOfNotification().then(res =>{
                this.setState({ notificationNumber : res.number })
            }).catch(err =>{
                console.log('Could not fetch profile')
            });
        }

    }
    isLoggedIn() {
        return this.Auth.loggedIn()
    }

    JoinDraft(id) {
        this.Auth.joinDraft(id).then(res =>{
                var string = '/draft/' + id
                return <Redirect to={string} />
            })
            .catch(err =>{
                alert(err);
            })
    }

    deleteNotfication(not) {
        this.Auth.deleteNotification(not).then(res =>{
            var notList =this.state.listOfNotificationObjects
            var notListElements =this.state.notificationList
             console.log('about to look')
            for (var i = 0; i < notList.length; i++) {
                if (not.content === notList[i].content && not.userBelongs === notList[i].userBelongs && not.draftId === notList[i].draftId) {
                    notList.splice(i, 1)
                    notListElements.splice(i, 1)
                }
            }
            this.setState({listOfNotificationObjects : notList, notificationList : notListElements})
            })
            .catch(err =>{
                alert(err);
            })
    }

    onClick() {
        var show = !this.state.showNotificationList
        if (!this.state.gotList) {
            this.Auth.getNotifications().then(res =>{
                var list = this.state.notificationList
                var listObjects = this.state.listOfNotificationObjects
                for (var i = 0; i < res.length; i++) {
                    var not = res[i]
                    if (res[i].content.includes("invited")) {
                        var draftId = res[i].draftId

                        list.push(<Dropdown.Item>{res[i].content}<Button variant="primary" onClick={() => this.JoinDraft(draftId)}>
                            Join Draft!
                        </Button><Button onClick={() => this.deleteNotfication(not)}>Delete</Button></Dropdown.Item>)
                    } else {
                        list.push(<Dropdown.Item>{res[i].content} <Button onClick={() => this.deleteNotfication(not)}>Delete</Button></Dropdown.Item>)
                    }

                    listObjects.push(res[i])
                }
                this.setState({notificationList : list, gotList : true, listOfNotificationObjects:listObjects, notificationNumber : 0})
            }).catch(err =>{
                console.log('Could not fetch profile')
            });
        }
        this.setState({showNotificationList : show})
    }

    render() {
        // this.getProfile();
        if (this.state.profile === null) {
            return (
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#home">Brett's Fantasy Football</Navbar.Brand>
                    <Nav className="mr-auto">
                    <Nav.Item>
                        <Nav.Link href="/">Home</Nav.Link>
                    </Nav.Item>
                        </Nav>
                </Navbar>
            );
        } else {
            if (this.state.showNotificationList) {
                return (
                    <Navbar bg="dark" variant="dark">
                        <Navbar.Brand href="/">Brett's Fantasy Football</Navbar.Brand>
                        <Nav className="mr-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/">{this.state.profile}</Nav.Link>
                            <Nav.Link href="/CreateDraft">Create Draft</Nav.Link>
                            <Nav.Item>
                                <DropdownButton variant="primary" onClick={this.onClick} title="Notifications">
                                    {this.state.notificationList}
                                </DropdownButton>
                            </Nav.Item>
                            <Nav.Item>
                                <Badge variant="light">{this.state.notificationNumber}</Badge>
                            </Nav.Item>
                        </Nav>
                    </Navbar>
                )
            } else {
                return (
                    <Navbar bg="dark" variant="dark">
                        <Navbar.Brand href="/">Brett's Fantasy Football</Navbar.Brand>
                        <Nav className="mr-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/">{this.state.profile}</Nav.Link>
                            <Nav.Link href="/CreateDraft">Create Draft</Nav.Link>
                            <Nav.Item>
                                <DropdownButton variant="primary" onClick={this.onClick} title="Notifications">
                                </DropdownButton>
                            </Nav.Item>
                            <Nav.Item>
                                <Badge variant="light">{this.state.notificationNumber}</Badge>
                            </Nav.Item>
                        </Nav>
                    </Navbar>
                );
            }
        }
    }
}

export default NavBar;
