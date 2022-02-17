/**
 * Creates a header or footer for the Practitioner Evaluation view. Both header and footer 
 * contain the same buttons. The header also displays explanatory text.
 * 
 * Properties:
 * isHeader
 * mode
 * loggedInUser
 * userHasEvaluated
 * enableEvaluation
 * saveEvaluation
 */
import React from 'react';
import { Button } from 'react-bootstrap';
import Instructions from './Instructions';

const evalHeaderFooter = (props) => {
    
    const introStyle={
        'margin': '.6em', 
        'fontWeight': 'bold'
    };

    const headerStyle = {
        'maxWidth': '700px !important',
        'width': '700px',
        'marginLeft': 'auto',
        'marginRight': 'auto',
        'marginTop': '1em',
        'padding': '5px',
        'fontWeight': 'normal'
    };

    const createMyEvaluationButton = (
        <Button type="button" key='1' className='' onClick={props.enableEvaluation}>
            Add your own evaluation
        </Button>
    )
    const editMyEvaluationButton = (
        <Button type="button" key='2' className='' onClick={props.enableEvaluation}>
            Edit your previous evaluation
        </Button>
    )
    const saveMyEvaluationButton = (
        <Button type="button" key='3' className='' onClick={props.saveEvaluation}>
            Save My Evaluation
        </Button>
    )
    const viewAllUserIncluded = (
        <div style={headerStyle} key='4' >
            <Instructions>
            <p>Below is a summary of all the evaluations of this practitioner.</p>
            {props.loggedInUser ? 
                <p><span className='bold'>To add your own evaluation</span> click on the button below. </p>
                : ''
            }
            <p>For the purposes of the following form:</p>
            <ul className='list'>
                <li>
                    ME refers to myalgic encephalomyelitis. 
                    ME is also known as ME/CFS, chronic fatigue syndrome, systemic exertion intolerance disease (SEID). 
                    For more information about names for the disease, 
                    refer to <a href='https://me-pedia.org/wiki/Names_of_myalgic_encephalomyelitis_and_chronic_fatigue_syndrome' target='_blank' rel='noopener noreferrer'>this MEPedia article</a>.
                </li>
                <li>
                    FM refers to fibromyalgia
                </li>
            </ul>
            </Instructions>
        </div>
    )

    const anyYouWant = (
        <div key='5' >
        <ul className='list'>
            <li>
                <span className='bold'>You do not need to answer every question.</span> Only answer the questions you know the answers to or feel comfortable answering.
            </li>
            <li>
                You can always return and do another evaluation, adding new information.
            </li>
            <li>
                Don’t forget to <span className='bold'>save your evaluation.</span>
            </li>
        </ul>
        </div>
    )
    
    const components = [];
    switch (props.mode) {
        case 'viewAll':
            if (props.isHeader) {
                components.push(viewAllUserIncluded);
            }
            if (props.loggedInUser){
                components.push(props.userHasEvaluated ? editMyEvaluationButton : createMyEvaluationButton);
            }
            break;
        case 'edit':
            if (props.isHeader) {
                components.push(anyYouWant);
            }
            components.push(saveMyEvaluationButton);
            break;
        default:  // view
            break;
    }

    return (
        <div style={introStyle}>
            {components}
        </div>
    )
}
export default evalHeaderFooter;