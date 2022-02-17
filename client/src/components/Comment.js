/**
 * Displays a single commment. A comment is at one of two levels
 * Level 1 comments are created with no reference to other comments
 * Level 2 comments are "responses" or "comments on comments"
 * 
 * A user can replay to a level 2 comment, but the new comment will be at the same level,
 * after all other level 2 comments at that level within the level 1 comment
 * 
 * A comment has a status, one of PENDING, MODERATED, FLAGGED or BLOCKED.
 * PENDING: Commment includes a 'Flag' button
 * MODERATED: Comment does not include the Flag button
 * FLAGGED: Comment displays a flag icon where the Flag button would otherwise be
 * BLOCKED: Coment text replaced with explanatory text 
 * 
 */
import React from 'react';

const comment = (props) => {
    const classes = props.level === 1 ? 'comment' : 'comment level2';
    const dateOptions = {year:'numeric', month:'long', day:'numeric', hour:'numeric', minute:'numeric' };
    const text = props.status === 'BLOCKED' ? 'Comment has been removed by moderator' : props.text
    return (
        <div className={classes}>
            <div className='comment-header'>
                <div className='comment-name'>{props.username}</div>
                <div className='comment-date'>{(new Date(props.date)).toLocaleDateString("en-US", dateOptions)}</div>
                { props.level === 1 && props.enabled ?
                    <input type='button' className='comment-button comment-reply' 
                        value='Reply' onClick={props.onClickReply}></input>
                    : ''
                }
                { props.status === 'FLAGGED' ?
                    <span className="comment-button comment-flag fas fa-flag"/>
                    : ''
                }
                { (props.status === 'PENDING' || props.status === 'MODERATED') && props.enabled ?
                    <input type='button' className='comment-button comment-flag' 
                        value='Flag' onClick={props.onClickFlag}></input>
                    : ''
                }
            </div>
            <div>
                {text}
            </div>
        </div>
    )
}
export default comment;