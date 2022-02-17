/**
 * Implements the Comments View, displaying all comments for a practitioner.
 * Comments are arranged in a two level hierarchy. The second level contains any 
 * comments entered as responses to a given comment. 
 * <p>
 * If the moderator has blocked a comment (either on their own initiative or
 * in response to a user flagging it) the offending text is replaced eith an explanation
 */
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Comment from '../components/Comment';
import NewComment from '../components/NewComment';
import * as actions from '../store/commentActions';
import Instructions from '../components/Instructions';

class PractitionerComments extends Component {

    state = {}

    constructor(props) { 
        super(props);

        this.openComment = this.openComment.bind(this);
        this.saveComment = this.saveComment.bind(this);
        this.closeComment = this.closeComment.bind(this);
        this.reply = this.reply.bind(this);
        this.flag = this.flag.bind(this);
        this.onChange = this.onChange.bind(this);
    }
 
    render() {
        // Comments for this practitioner
        const commentMap = this.props.allComments[this.props.match.params.id];
        // Flatten out
        let comments = [];
        for (let id in commentMap){
            comments = comments.concat([commentMap[id].comment], commentMap[id].responses)
        }

        return (
            <>
            <Instructions width='90%'>
                Please respect that this is a public site providing useful information for ME and fibromyalgia patients, 
                not a place to “let it all out”. While we want honest comments and information, the goal is to provide 
                information about helpful health care providers, and not to provide a platform to excoriate doctors or other 
                healthcare professionals. Moderators will remove any offending comments.                
            </Instructions>

            {this.props.loggedInUser ? 
                <Button type="button" className='button-large' onClick={this.openComment}>Add a New Comment</Button>
                : ''
            }     

            <NewComment show={this.state.showModal} 
                onSave={this.saveComment} 
                onCancel={this.closeComment}
                onChange={this.onChange} 
                value={this.state.commentText}/>
            
            {
            comments.length === 0 ?
            <Instructions width='40em'>
                There are no comments on this practitioner
            </Instructions>
            :
            <div className='comments'>
                {
                comments.map((comment, index) => {
                    const username = this.props.allUsers[comment.userId].username;
                    return (
                        <Comment
                            enabled={this.props.loggedInUser != null} 
                            level={comment.parentId ? 2 : 1} 
                            text={comment.text} 
                            key={index}
                            username={username}
                            date={comment.date}
                            status={comment.status}
                            onClickReply={() => this.reply(comment.id)}
                            onClickFlag={() => this.flag(comment)}/>
                    )
                })
                }
            </div>
            }
            </>
        )
    }

    openComment() { 
        this.setState({ 
            showModal: true,
            commentText: ''
        }) 
    }

    closeComment() { 
        this.setState({ 
            showModal: false,
            commentText: '',
            parentId: null
        }) 
    }

    onChange(event) {
        this.setState({ 
            commentText: event.target.value
        }) 
    } 

    saveComment() {
        this.props.saveComment({
            parentId: this.state.parentId,
            practitionerId: this.props.match.params.id,
            userId: this.props.loggedInUser.id,
            date: new Date().getTime(),
            text: this.state.commentText,
            status: 'PENDING'
        })
        this.closeComment();
    }

    /** User has clicked the "Reply" button on a specific comment */
    reply(parentId) {
        this.setState({ 
            showModal: true,
            commentText: '',
            parentId: parentId
        }) 
    }
    /** User has clicked the "Flag" button on a specific comment */
    flag(comment) {
        this.props.flagComment(comment);
    }
}

const mapStateToProps = state => {
    return {
        loggedInUser: state.userReducer.loggedInUser,
        allUsers: state.userReducer.allUsers,
        allComments: state.commentReducer.allComments
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveComment: (comment) => dispatch(actions.saveComment(comment)),
        flagComment: (comment) => dispatch(actions.flagComment(comment))
    }
}

export default  withRouter(connect(mapStateToProps, mapDispatchToProps)(PractitionerComments));
