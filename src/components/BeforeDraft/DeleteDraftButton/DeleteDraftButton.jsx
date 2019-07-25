import React from 'react';
import './DeleteDraftButton.css';
import { Button} from 'react-bootstrap';
import AuthService from '../../AuthService';

class DeleteDraftButton extends React.Component {

    constructor(props){
        super(props);
        this.Auth = new AuthService();
        this.state = {
            draftInfo: this.props.prevState.draftInfo,
            user :  this.props.prevState.user
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.Auth.deleteDraft(this.state.draftInfo.id)
            .then(res =>{
                // return  <Redirect to="/"/>
            })
            .catch(err =>{
                alert(err);
            })
    }

    render() {
        var user = this.state.user;
        if (user != null && this.state.draftInfo.userCreated.userName === user && this.state.draftInfo.wasRunning === "no") {
            return (
                <Button variant="primary" size="lg" onClick={this.handleClick}>Delete Draft</Button>
            );
        }
        return (
            <div>
            </div>
        );
    }
}

export default DeleteDraftButton;