/**
 * A group of PENDING or FLAGGED comments displayed at the same time.
 * The user pages through each block.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Button } from 'react-bootstrap';
import Instructions from '../components/Instructions';
import PendingComment from '../components/PendingComment';
import axios from 'axios';

class PendingCommentBlock extends Component {
    
    state = {}

    BLOCK_SIZE = 10;
    ACCEPT_ACTION = 'Accept';
    BLOCK_ACTION = "Block";

    constructor(props){
        super(props);
        this.state.actionLabel = this.props.type === 'FLAGGED' ? 'Accept' : 'Block';

        // Group the comments
        this.state.startIndex = 0;
        this.state.endIndex = this.props.comments.length > this.BLOCK_SIZE ? this.BLOCK_SIZE -1 : this.props.comments.length - 1;

        // Map comment Id's to comments
        const commentsMap = {};
        this.props.comments.forEach(comment => {
            commentsMap[comment.id] = comment;
        })
        
        this.state.commentsMap = commentsMap;
        this.state.commentsToResolve = [];

        this.onAction = this.onAction.bind(this);
        this.resolveAndNext = this.resolveAndNext.bind(this);
    }

    nextBlock(){
        const remaining = this.props.comments.length - this.state.startIndex;
        if (remaining <= 0){
            return [];
        }
        const size = remaining > this.BLOCK_SIZE ? this.BLOCK_SIZE : remaining;
        const comments = Array.prototype.slice.call(this.props.comments);
        const block =  comments.splice(this.state.startIndex, size);
        return block;
    }

    /** The moderator has clicked the checkbox to toggle the status of the comment */
    onAction(event){
        const commentId = event.target.id;
        const comment = this.state.commentsMap[commentId];
        if (this.props.type === 'FLAGGED'){
            comment.status = comment.status === 'FLAGGED' ? 'MODERATED' : 'FLAGGED';
        }
        else { // PENDING
            comment.status = comment.status === 'PENDING' ? 'BLOCKED' : 'PENDING';
        }
    }

    resolveAndNext(){
        if (this.props.type === 'FLAGGED'){
            // All comments in the displayed block which the moderator has not switched 
            // to MODERATED will be blocked.
            for (let i = this.state.startIndex; i <= this.state.endIndex; i++){
                if (this.props.comments[i].status === 'FLAGGED'){
                    this.props.comments[i].status = 'BLOCKED';
                }
            }
        }
        else { // PENDING
            // All comments in the displayed block which the moderator has not switched 
            // to BLOCKED will be accepted.
            for (let i = this.state.startIndex; i <= this.state.endIndex; i++){
                if (this.props.comments[i].status !== 'BLOCKED'){
                    this.props.comments[i].status = 'MODERATED';
                }
            }
        }
        // Send the updates to the server 
        axios.post('/comments/resolve?moderator=' + this.props.loggedInUser.id, 
            this.props.comments.slice(this.state.startIndex, this.state.endIndex + 1));
        
        this.setState({
            startIndex: this.state.startIndex + this.BLOCK_SIZE
        })
    }

    render(){
        const commentsToDisplay = this.nextBlock()
        const allResolved = commentsToDisplay.length === 0
        const idToPractitioner = this.props.idToPractitioner

        const panelStyle = {
            width:'90%',
            margin: 'auto',
            marginBottom: '2em'
        };
        return (
            <Panel style={panelStyle}>
            <Panel.Body>
                {  allResolved ? ''
                    :
                    <Instructions width='40em'>
                    { this.props.type === 'FLAGGED' ?
                        'The comments below have been flagged by a user as unacceptable. '
                        + 'If you do not agree (i.e. you feel the comment is acceptable, press the Accept button. '
                        + 'Press the Resolve button to confirm your decisions, and to view the next set of comments.'
                        :
                        'If any of the comments below are unacceptable, press the Block button. '
                        + 'Press the Resolve button to confirm your decisions, and to view the next set of comments.'
                    }
                    </Instructions>
                }
                {
                    commentsToDisplay.map((comment) => {
                        if (!comment.userId || this.props.allUsers[comment.userId] == null){
                            return ''
                        }
                        else {
                            return <PendingComment
                                key={comment.id}
                                id={comment.id} 
                                username={this.props.allUsers[comment.userId].username}
                                practitioner={idToPractitioner[comment.practitionerId].firstName + ' ' + idToPractitioner[comment.practitionerId].lastName} 
                                text={comment.text} 
                                actionLabel={this.state.actionLabel}
                                onAction={this.onAction}
                                />
                        }
                    })
                }
                { allResolved ?
                    <Instructions width='40em'>
                    { this.props.type === 'FLAGGED' ?
                        'All flagged messages are now resolved'
                        :
                        'All pending messages have been processed'
                    }
                    </Instructions>
                    :
                    <div style={{borderTop: '2px solid #dce4ec'}}>
                    <Button type="button" className='button-large' 
                        onClick={this.resolveAndNext}>
                        Resolve
                    </Button>
                    </div>
                }            
            </Panel.Body>
            </Panel>
        )
    }
}

const mapStateToProps = state => {
    return {
        allUsers: state.userReducer.allUsers,
        loggedInUser: state.userReducer.loggedInUser,
        idToPractitioner: state.practitionersReducer.idToPractitioner
    }
}

export default  connect(mapStateToProps)(PendingCommentBlock);
    