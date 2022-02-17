/**
 * A wrapper for an input control displaying Yes and No radio buttons
 * 
 * Its behaviour depends on the props.mode property as follows:
 * 'view':   renders as a disabled radio group, with the current value checked
 * 'create': renders as an enabled radio group
 * 'edit':   renders as an enabled radio group, with the current value checked
 * 
 * Additional props:
 * name:                optional control name
 * label:               the control label
 * labelClass:          label style class
 * valueClass:          value style class
 * currentValue:        the current value (relevant only if mode is 'edit')
 * changeHandler:       function to receive the onChange event     
 * dimensions:          12-column grid dimensions of the label and radio group in format "x1,x2[,x3]"
 *                      where x1 = column width of label
 *                        x2 = column width of the value
 *                        x3 = column odffset of label (optional)
 *                      if not included, the default value is "3:9"
 * answers              array of all values that have been selected for the question
 * userAnswer :         recommendation 'RATE' action previously performed by the user
 */
import React from 'react';
import RadioGroup from './RadioGroup';
import RadioResults from './RadioResults';
import { parseDimensions } from '../common/utilities';

const yesNo = (props) => {

    let labelClasses = props.labelClass;
    let valueClasses = props.valueClass;
    if (props.dimensions){
        let d = parseDimensions(props.dimensions);
        labelClasses += ' ' + d.labelWidth + ' ' + d.labelOffset;
        valueClasses += ' ' + d.valueWidth;
    }
    // TODO: resolve mode definitions
//    const mode = props.mode === 'viewAll' ? 'view' : props.mode;

    let component = undefined;
    if (props.mode === 'viewAll'){
        component = (
            <RadioResults
                name={props.name}
                className={valueClasses}            
                options={[{ label: 'Yes' }, { label: 'No' }]}
                answers = {props.answers}
            />
        )
    }
    else {
        const yesChecked = props.userAnswer && props.userAnswer.value === 1;
        const noChecked = props.userAnswer && props.userAnswer.value === 0;

        component = (
            <RadioGroup
                name={props.name}
                disabled={props.mode === 'view'}
                onChange={props.onChange}
                className={valueClasses}
            
                options={[
                    { 
                        label: 'Yes', 
                        value: 'Yes', 
                        checked: yesChecked 
                    },
                    { 
                        label: 'No', 
                        value: 'No',
                        checked: noChecked  
                    }
                ]}
            />
        )
    }

    return (
        <div className='input-wrapper'>
            <span className={labelClasses}>{props.label}</span>
            {component}
        </div>
    )
}

export default yesNo;