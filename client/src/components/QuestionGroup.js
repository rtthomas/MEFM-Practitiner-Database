/**
 * Wraps a group of questions with the group title
 * 
 * title:
 * questions
 * mode
 * onChange
 * choiceSets
 * answers
 * userAnswers: recommendation 'RATE' actions previously performed by the user
 */
import React from 'react';
import YesNo from '../components/YesNo';
import Selector from '../components/Selector';

const questionGroup = props => {

    let maxLabelLength = props.questions.reduce((max, question) => {
        return question.text.length > max ? question.text.length : max;
    }, 0);
    const labelClasses = maxLabelLength > 20 ? 'info-label-group' : 'info-label-group right';

    return (
        <>
            <div className='question bold'>{props.title}</div>
            {props.questions.map( (question, index) => {
                
                const answers = props.answers ? props.answers[question.id] : null;
                const userAnswer = props.userAnswers ? props.userAnswers[question.id] : null;
                const userHasEvaluated = props.userAnswers != null;
                
                if (question.type ==='YES_NO'){
                    return (
                        <YesNo
                            name={'questionId-' + question.id}
                            key={index}  
                            label={question.text} 
                            valueClass='info-field' 
                            labelClass={labelClasses} 
                            dimensions='8,4'
                            mode={props.mode} 
                            onChange={props.onChange}
                            answers={answers}
                            userAnswer={userAnswer}
                        />
                    )
                }
                else {
                    const options=props.choiceSets[question.questionChoiceSetId];
                    const userAnswers = userHasEvaluated ? props.userAnswers : null;
                    const userAnswer = userAnswers ? userAnswers[question.id] : null;
                    const value = userAnswer ? {label: options[userAnswer.value], value: userAnswer.value} : '';

                    return (
                        <Selector
                            name={'questionId-' + question.id}
                            key={index} 
                            label={question.text}
                            valueClass='info-field'
                            labelClass={labelClasses}
                            mode={props.mode} 
                            dimensions='8,4'
                            onChange={props.onChange}
                            placeholder='Choose one...'
                            options={options}
                            value = {value} 
                            answers={answers}
                        />
                    )
                }
            })}
        </>
    )

}

export default questionGroup;