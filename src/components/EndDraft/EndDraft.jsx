import React from 'react';
import './EndDraft.css';
import TeamDisplay from '../DuringDraft/TeamDisplay/TeamDisplay'
import PlayerHistory from '../DuringDraft/PlayerHistory/PlayerHistory'

class EndDraft extends React.Component {

    constructor(props){
        super(props);

        // TODO: remove some stuff
        this.state = {
            time : 0,
            draftId: props.prevState.draftInfo.id,
            picks : null,
            playerSelected: null,
            buttonDisable : true,
            user : props.prevState.user,
            originalPicks : null,
            pickHistory : null,
            lastPick: null
        };
    }
    render() {
        return (
            <div>
                <TeamDisplay prevState={this.state}></TeamDisplay>
                <PlayerHistory prevState={this.state}></PlayerHistory>
            </div>
        );
    }
}

export default EndDraft;