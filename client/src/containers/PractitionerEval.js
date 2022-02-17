/**
 * Implements the Practitioner Evaluation View. 
 * 
 * The view's appearance and behaviour take three forms, determined by the local mode:
 * - viewAll: each question is displayed read only with the averaged recommendations of all users
 * - edit: each question is displayed editable with the recommendation values of the current user
 * - create: the Practitioner has just been created; all fields re editable
 * 
 * Edit mode corresponds to either the first time a user makes a recommendation, or subsequent changes
 * by the user.
 * 
 * When the component mounts, the mode is initialized to viewAll. If there is a logged in user,
 * the user can subsequently switch the mode to view or edit
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/evaluationActions';
import YesNo from '../components/YesNo';
import Selector from '../components/Selector';
import QuestionGroup from '../components/QuestionGroup';
import EvalHeaderFooter from '../components/EvalHeaderFooter';
import axios from 'axios';

class PractitionerEval extends Component {
    
    state = {}

    constructor(props){
        super(props);

        this.createQuestionItems();        

        // Map of questionId to question
        // TODO: Could be done in reducer. Not put in state because it is fixed 
        this.questionMap = [];
        this.props.questions.forEach(question => {
            this.questionMap[question.id] = question;
        })

        this.onChange = this.onChange.bind(this);
        this.enableEvaluation = this.enableEvaluation.bind(this);
        this.saveEvaluation = this.saveEvaluation.bind(this);

        this.state.practitionerId = this.props.match.params['id'];
        this.state.mode = this.props.newPractitioner ? 'create' : 'viewAll';
    }

    createQuestionItems(){
        // TODO: These could be entirely created in the practitionerReducer
        this.questionChoiceSets = this.createQuestionChoiceSets(this.props.questionChoices);
        this.questionGroups = this.createQuestionGroups(this.props.questions, this.props.questionGroups);
        
        this.components = [];
        
        let i = 0;
        let question = this.props.questions[i];
        while (i < this.props.questions.length) {
            let component = {};
            component.key = i;
            if (question.questionGroupId){
                component.isGroup = true;
                component.title = this.questionGroups[question.questionGroupId].title
                component.items = [];
                const groupId = question.questionGroupId;

                while (i < this.props.questions.length && question.questionGroupId === groupId){
                    component.items.push(question);
                    question = this.props.questions[++i];
                }
            }
            else {
                component.title = question.text;
                component.question = question;
                question = this.props.questions[++i];
            }
            this.components.push(component);
        }
    }

    /**
     * Combines the Question and QuestionGroup entities. 
     * @param {*} questions array of Question entities
     * @param {*} groups array of QuestionGroup entities
     * @returns an array {title, members} where 
     *          title = the QuestionGroup title
     *          members = array of Questions comprising the group
     */
    createQuestionGroups(questions, groups){
        const groupTitles = {};
        groups.forEach(group => {
            groupTitles[group.id] = group.title;
        });

        const assembledGroups = {};
        questions.forEach(question => {
            if (question.questionGroupId){
                let questionGroup = assembledGroups[question.questionGroupId];
                if (!questionGroup){
                    questionGroup = {
                        title: groupTitles[question.questionGroupId],
                        members: []
                    }
                    assembledGroups[question.questionGroupId] = questionGroup;
                }
                questionGroup.members.push({question})
            } 
        });
        return assembledGroups;
    }

    /**
     * Create the option lists used in the Selector components
     * @param {*} questionChoices array of QuestionChoice entities
     * @return map of questionChoiceSetId to the array of choice item strings  
     */
    createQuestionChoiceSets(questionChoices){
        const choiceSets = {};
        questionChoices.forEach(choice => {
            const setId = choice.questionChoiceSetId;
            if (!choiceSets[setId]){
                choiceSets[setId] = [];
            }
            choiceSets[setId].push(choice.text);
        });
        return choiceSets;
    }

    render() {
        const userHasEvaluated = this.props.userAnswers != null 
            && Object.keys(this.props.userAnswers).length > 0;
        return (
            <>
            <EvalHeaderFooter 
                mode={this.state.mode} 
                isHeader='true' 
                loggedInUser = {this.props.loggedInUser}
                userHasEvaluated = {userHasEvaluated}
                enableEvaluation={this.enableEvaluation} 
                saveEvaluation={this.saveEvaluation}/>
            <div className='vertical-group'>
                {this.components.map( component => {
                    if (component.isGroup){
                        return (
                            <div key={component.key} className='question-wrapper bordered vertical-group'>
                            <QuestionGroup 
                                title={component.title}
                                questions={component.items}
                                mode={this.state.mode}
                                onChange={this.onChange}
                                choiceSets={this.questionChoiceSets}
                                answers={this.props.allAnswers}
                                userAnswers={this.props.userAnswers} 
                            />
                            </div>
                        )
                    }
                    else {
                        if (component.question.type ==='YES_NO'){
                            return (
                                <div key={component.key} className='question-wrapper bordered vertical-group'>
                                <YesNo
                                    name={'questionId-' + component.question.id}  
                                    label={component.question.text} 
                                    valueClass='info-field' 
                                    labelClass='question bold' 
                                    mode={this.state.mode} 
                                    dimensions='8,4'                         
                                    onChange={this.onChange}
                                    answers={this.props.allAnswers[component.question.id]}
                                    userAnswer={userHasEvaluated ? this.props.userAnswers[component.question.id] : null} 
                                    />
                                </div>
                            )
                        }
                        else if (component.question.type ==='SINGLE_CHOICE'){
                            const options=this.questionChoiceSets[component.question.questionChoiceSetId];
                            const userAnswers = userHasEvaluated ? this.props.userAnswers : null;
                            const userAnswer = userAnswers ? userAnswers[component.question.id] : null;
                            const value = userAnswer ? {label: options[userAnswer.value], value: userAnswer.value} : '';
                            return (
                                <div key={component.key} className='question-wrapper bordered vertical-group'>
                                <Selector
                                    name={'questionId-' + component.question.id} 
                                    label={component.question.text}
                                    mode={this.state.mode}
                                    onChange={this.onChange}
                                    dimensions='8,4'
                                    placeholder='Choose one...'  
                                    valueClass='info-field' 
                                    labelClass='question bold'  
                                    options={options}
                                    answers={this.props.allAnswers[component.question.id]}
                                    value = {value} 
                                    />
                                </div>
                            )
                        }
                        else {
                            return ''
                        }
                    }
                }, this)}
            </div>
            {this.props.loggedInUser ?
                <EvalHeaderFooter 
                    mode={this.state.mode} 
                    loggedInUser = {this.props.loggedInUser}
                    userHasEvaluated = {userHasEvaluated}
                    enableEvaluation={this.enableEvaluation} 
                    saveEvaluation={this.saveEvaluation}/>
                : ''
            }
            </>
        )
    }

    saveEvaluation(){
        const ratings = Object.getOwnPropertyNames(this.props.queuedUserRatings).reduce( (userRatingsArray, questionId) => {
            userRatingsArray.push(this.props.queuedUserRatings[questionId]);
            return userRatingsArray;
        }, [])
        axios.post('/actions/', ratings)
            .then( response => {
                this.props.storeRatingActionIds(ratings, response.data);
            });
        this.setState(() => ({ 
            mode: 'viewAll'
        }));
    }

    enableEvaluation(){
        this.setState(() => ({ 
            mode: 'edit'
        }));
    }

    /**
     * Responds to a user performing an evaluation action
     * @param {Event} event 
     */
    onChange(event){
        // TODO-SELECT
        let rating = event.target ? event.target.value : event.value;
        let controlName = event.target ? event.target.name : event.name;

        const questionId = controlName.split('-')[1];
        const question = this.questionMap[questionId];
        
        let value = undefined;
        if (question.type === 'YES_NO'){
            value = rating === "No" ? 0 : 1
        }
        else { // Single choice
            const choiceSet = this.questionChoiceSets[question.questionChoiceSetId]; 
            value = choiceSet.indexOf(rating);
            value = value >= 0  ? value : undefined;
        }

        if (value !== undefined){        
            const recommendationAction = {
                practitionerId: this.state.practitionerId,
                userId: this.props.loggedInUser.id,
                actionType: 'RATE',
                questionId: questionId,
                value: value,
                date: (new Date()).getTime()
            };
            this.props.saveUserRatingAction(recommendationAction);
        }
    }
}

const mapStateToProps = state => {
    return {
        questions: state.evaluationReducer.questions,
        questionGroups: state.evaluationReducer.questionGroups,
        questionChoices: state.evaluationReducer.questionChoices,
        loggedInUser: state.userReducer.loggedInUser,
        allRecommendations: state.evaluationReducer.allRecommendations,
        userAnswers: state.evaluationReducer.userAnswers,
        allAnswers: state.evaluationReducer.allAnswers,
        queuedUserRatings: state.evaluationReducer.queuedUserRatings
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveUserRatingAction: (recommendation) => 
            dispatch({ type: actions.SAVE_USER_RATING_ACTION, recommendation: recommendation }),
        storeRatingActionIds: (ratings, idArray) => 
            dispatch({ type: actions.STORE_RATING_ACTION_IDS, ratings: ratings, idArray: idArray})
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PractitionerEval));