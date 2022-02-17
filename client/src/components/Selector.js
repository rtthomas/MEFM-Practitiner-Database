/**
* A wrapper for a (single) select control . 
* Its behaviour depends on the mode property as follows:
* 'view':   renders disabled, displaying the current value
* 'viewAll':renders as a star rating according to the values in the answers property
* 'edit':   renders as a selector, with the current value
* 
* Additional props:
* name:                 optional control name               
* label:                the control label
* labelClass:           label style class
* valueClass:           value style class
* options:              array of options, each one either a text string,
*                       or {'label': string, 'options': [{label: string, value: object }]} if options are to be grouped
* selectHandler:        function to receive the onChange event     
* dimensions:           12-column grid dimensions of the label and options list in format "x1,x2[,x3]"
*                       where x1 = column width of label
*                        x2 = column width of the value
*                        x3 = column odffset of label (optional)
*                       if not included, the default value is "3:9"
* answers               array of all values that have been selected for the question, if any
* value:                the current selected value
*/
import React from 'react';
import { parseDimensions } from '../common/utilities';
import StarRating from './StarRating';
import Select from 'react-select';

const control = (provided, state) => ({
    ...provided,
    alignItems: 'left',
    width: '15em',
    maxHeight: '32px',
    minHeight: '32px',
    padding: '0px 0px',
    border: '2px solid #dce4ec',
    borderRadius: '4px',
    backgroundColor: '#ecf0f1',
    color: '#2c3e50',
    marginTop: '3px'
});

const placeholder = (provided, state) => ({
    ...provided,
    position: 'static',
    verticalAlign: 'middle',
    transform: ''
}) 

const option = (provided, state) => ({
    ...provided,
    textAlign: 'left'
})

const groupOption = (provided, state) => ({
    ...provided,
    textAlign: 'left',
    paddingLeft: '1em',
    fontSize: '90%'
})

const groupHeading = (provided, state) => ({
    ...provided,
    textAlign: 'left',
    textTransform: '',
    fontWeight: 'bold',
    fontSize: '100%',
    color: '#2c3e50'
})

const onChange = ((event, props) => {
    event = {...event, name: props.name};
    props.onChange(event);
})

const selector = (props) => {    
     
    let labelClasses = props.labelClass;
    let valueClasses = props.valueClass;
    if (props.dimensions){
        let d = parseDimensions(props.dimensions);
        labelClasses += ' ' + d.labelWidth + ' ' + d.labelOffset;
        valueClasses += ' ' + d.valueWidth;
    }

    let component = undefined;
    if (props.mode === 'viewAll'){
        if (props.answers) {
            let sum = props.answers.reduce((sum, answer) => {
                // Choice values start at zero, so add an offset 
                return sum + answer + 1;
            }, 0);
            let value = props.answers.length === 0 ? 0 : sum / props.answers.length;
            // TODO Number of answers may vary in the future, so scale to 5
            // Requires acces to the choice set for the question 
            component = <StarRating className={valueClasses} value={value}/>
        }
        else {
            component = <span className={valueClasses}>No answers</span>
        }
    }
    else {
        const optionsAreGrouped = props.options.length > 0 && (typeof props.options[0] === 'object');
        
        const options = optionsAreGrouped ? 
            props.options
            :
            props.options.map( option => {
                return {'label': option, 'value':option}
            });
        
        const customStyles = optionsAreGrouped ?
            { control, placeholder, option: groupOption, groupHeading }
            :
            { control, placeholder, option };            
        
        component= (
            <Select
                options={options} 
                placeholder={props.placeholder}
                onChange={event => {onChange(event, props)}}
                isDisabled={props.mode === 'view'}
                name={props.name}
                styles={customStyles}
                value={props.value}
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
   
export default selector;
        