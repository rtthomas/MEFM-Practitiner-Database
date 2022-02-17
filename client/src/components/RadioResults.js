/**
 * A component to replace a RadioGroup in view mode. Rather than
 * displaying a radio control beside each value label it displays
 * the count of each selection. 
 * 
 * Propertiess:
 * name:            optional control name
 * label:           the control label
 * options:         array of options in the form "{label: <a value label>}"
 * answers
 */
import React from 'react';

const radioResults = (props) => {
    if (props.answers) {    
        const totalNo = countValues(props.answers, 0);
        const totalYes = countValues(props.answers, 1);
        return (
            <div className={'radio-group bordered ' + props.className}>
                <div style={{ display: 'inline', float: 'left' }}>
                    <label>Yes</label>
                    &nbsp;
                    <span>{totalYes}</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <div style={{ display: 'inline', float: 'left' }}>
                    <label>No</label>
                    &nbsp;
                    <span>{totalNo}</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
            </div>
        )
    }
    else {
        return <span className={'radio-group bordered ' + props.className}>No answers</span>
    }
}

const countValues = (answers, value) => {
    return answers.map(x => {
        const result = x === value;
        return result 
    })
    .reduce((total, x) => {
        return total + x
    }, 0)
}
export default radioResults;
