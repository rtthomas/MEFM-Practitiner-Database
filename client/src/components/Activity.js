/**
 * Displays a single activity description
 */
import React from 'react';
import  '../css/myactivity.css';

const activity = props => {
    return (
        <div className='activity'>
            <div className='date'>{props.date}</div>
            <div className='description'>{props.description}</div>
        </div>
    )
}

export default activity;