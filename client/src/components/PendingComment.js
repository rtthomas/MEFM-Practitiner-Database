/**
 * Displays a comment for the moderator to review. The moderator 
 * can perform a single action to resolve the comment 
 */
import React from 'react';
import Radium from 'radium';

const pendingComment = props => {
    return (
        <div style={comment}>
            <div style={username}>
                {props.username}
            </div>
            <div style={practitioner}>
                {props.practitioner}
            </div>
            <div style={text}>
                {props.text}
            </div>
            <div style={action}>
                <input type="checkbox" id={props.id} onClick={props.onAction}/>
                <label style={{display: 'inline', marginLeft: '5px'}}>{props.actionLabel}</label>
            </div>
        </div>
    )
}

const comment = {
	display: 'flex',
	borderTop: '2px solid #dce4ec',
	borderLeft: '2px solid #dce4ec',
	borderRight: '2px solid #dce4ec',
	textAlign: 'left',
	padding: '2px'
}
const username = {
	marginRight: 'auto',
	flexBasis: '10%',
    borderRight: '1px solid #dce4ec',    
    '@media (max-width: 1024px)': {
        flexBasis: '15%'
    },    
    '@media (max-width: 768px)': {
        flexBasis: '20%'
    }    
}
const practitioner = {
	display: 'inline',
	marginRight: 'auto',
	textAlign: 'left',
	flexBasis: '10%',
	borderRight: '1px solid #dce4ec',
	padding: '0 5px',
    '@media (max-width: 1024px)': {
        flexBasis: '15%'
    },    
    '@media (max-width: 768px)': {
        flexBasis: '20%'
    }    
}
const text = {
	display: 'inline',
	marginRight: 'auto',
	textAlign: 'left',
	flexBasis: '73%',
	borderRight: '1px solid #dce4ec',
	padding: '0 5px',
    '@media (max-width: 1024px)': {
        flexBasis: '65%'
    },    
    '@media (max-width: 768px)': {
        flexBasis: '55%'
    }    
}
const action = {
	display: 'inline',
	marginLeft: '0.5em',
	flexBasis: '7%',
	fontWeight: 'normal',
    '@media (max-width: 1024px)': {
        flexBasis: '10%'
    },    
    '@media (max-width: 768px)': {
        flexBasis: '15%'
    }    
}

export default Radium(pendingComment);
