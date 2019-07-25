import React from 'react';
import './JoinDraft.css';
import { Button} from 'react-bootstrap';
import AuthService from '../../AuthService';

class JoinDraft extends React.Component {

    constructor(props){
        super(props);
        this.Auth = new AuthService();
        this.state = {
            draftInfo: this.props.prevState.draftInfo,
            invitedUsers : this.props.prevState.invitedUsers,
            accepted : this.props.prevState.accepted,
            user :  this.props.prevState.user
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.Auth.joinDraft(this.state.draftInfo.id)
            .then(res =>{
                window.location.reload();
            })
            .catch(err =>{
                alert(err);
            })
    }

    render() {
        var user = this.state.user;
        if (user != null && this.state.draftInfo.userCreated.userName != user && this.state.invitedUsers.includes(user) && !this.state.accepted.includes(user)) {
            return (
                <Button variant="primary" size="lg" onClick={this.handleClick}>Join Draft!</Button>
            );
        }
        return (
            <div>
            </div>
        );
    }
}

export default JoinDraft;