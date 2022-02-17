/**
 * A wrapper for a radio group . 
 * It's behaviour depends on the props.mode property as follows:
 * 'view':   renders disabled, displaying the current values
 * 'create': renders enabled with no selection
 * 'edit':   renders enabled, with the current value 
 * 
 * Additional props:
 * name:            optional control name
 * label:           the control label
 * value:           the current selected value
 * options:         array of options in the form "{label: <a value label>, value: <the corresponding value> [,checked: <any value>]"
 *                  If the checked option is included, the radio button will be initialized as selected
 * selectHandler:   function to receive the onChange event     
 */
import React from 'react';
const radioGroup = (props) => {
    return (
        <div className={'radio-group bordered ' + props.className}>
            {
                props.options.map((option, index) => {
                        return (
                            <div 
                                key={index} 
                                style={{ display: 'inline', float: 'left' }}>
                                <label htmlFor={option.value}>{option.label}</label>
                                &nbsp;
                                <input type='radio'
                                    disabled={props.disabled}
                                    onChange={props.onChange}
                                    name={props.name}
                                    value={option.value}
                                    checked={option.checked}
                                />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>
                        )
                    }
                )
            }
        </div>
    )
}

export default radioGroup;