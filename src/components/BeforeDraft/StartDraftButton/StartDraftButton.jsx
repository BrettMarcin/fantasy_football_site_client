import React from 'react';
import './StartDraftButton.css';
import { Button} from 'react-bootstrap';
import AuthService from '../../AuthService';

class StartDraftButton extends React.Component {

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
        this.resumeHandleClick = this.resumeHandleClick.bind(this);
    }

    handleClick(){
        this.Auth.startDraft(this.state.draftInfo.id)
            .then(res =>{
                window.location.reload();
            })
            .catch(err =>{
                alert(err);
            })
    }

    resumeHandleClick(){
        this.Auth.resumeDraft(this.state.draftInfo.id)
            .then(res =>{
                window.location.reload();
            })
            .catch(err =>{
                alert(err);
            })
    }

    render() {
        var user = this.state.user;
        if (user != null && this.state.draftInfo.userCreated.userName === user) {
            if (this.state.draftInfo.wasRunning === "pause") {
                return (
                    <Button variant="primary" size="lg" onClick={this.resumeHandleClick}>Resume Draft!</Button>
                );
            } else {
                return (
                    <Button variant="primary" size="lg" onClick={this.handleClick}>Start Draft!</Button>
                );
            }
        }
        return (
            <div>
            </div>
        );
    }
}

export default StartDraftButton;