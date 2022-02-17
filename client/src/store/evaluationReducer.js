/**
* This reducer deals with all state related to practitioner evaluations
*/
import * as actions from './evaluationActions';

const initialState = {
    questions: [],          // All questions (invariant)
    questionGroups: [],     // All question groups (invariant)
    questionChoices: [],    // All question choices (invariant)
    allRecommendations: {},
    userActions: [],
    userAnswers: {},
    queuedUserRatings: {},
    allAnswers: {}
}

const evaluationReducer = (state = initialState, action) => {

    switch (action.type) {
        case actions.STORE_QUESTIONS:
            console.log(actions.STORE_QUESTIONS)
            const questions = action.questions.sort(function(a, b){return a.displayIndex - b.displayIndex});
            return {
                ...state,
                questions: state.questions.concat(questions)
            }
        
        case actions.STORE_QUESTION_GROUPS:
            console.log(actions.STORE_QUESTION_GROUPS)
            return {
                ...state,
                questionGroups: state.questionGroups.concat(action.questionGroups)
            }
        
        case actions.STORE_QUESTION_CHOICES:
            console.log(actions.STORE_QUESTION_CHOICES)
            return {
                ...state,
                questionChoices: state.questionChoices.concat(action.questionChoices)
            }
            
        // Stores all actions by all users for a practitioner, received from the server
        case actions.STORE_ALL_RECOMMENDATION_ACTIONS: 
            return storeAllRecommendationActions(state, action);
        
        // Saves a single rating action. It will only be sent to the server when
        // the "Save My Evaluations" button is pressed   
        case actions.SAVE_USER_RATING_ACTION:
            return saveUserRatingAction(state, action);

        case actions.STORE_RATING_ACTION_IDS:
            return storeRatingActionIds(state, action);

        // Clears all recommendation actions by all users for the "current" practitioner
        case actions.CLEAR_ALL_RATINGS :
            return clearAllRatings(state);

        default: 
            return state;
    }
}

const storeAllRecommendationActions = (state, action) => {

    const allRecommendations = removePreviousAnswers(action.allRecommendations);
    const newAllRecommendations = {...state.allRecommendations};
    newAllRecommendations[action.practitionerId] = allRecommendations;

    // Save rating recommendation answers in separate             
    const allActionsAndAnswers = findUserActionsAndAnswers(action.userId, allRecommendations);
    return {
        ...state,
        allRecommendations: newAllRecommendations,
        userActions: allActionsAndAnswers.userActions,
        userAnswers: allActionsAndAnswers.userAnswers,
        allAnswers: allActionsAndAnswers.allAnswers
    }
}

// When a user changes her mind, the new action does not override the previous
// one. This supports the idea of a complete history of actions. However, only
// the most recent one must be used. Otherwise the average rating will not be correct 
const removePreviousAnswers = allRecommendations => {
    // Create a map of userid to a map of questionId to recommendation. 
    // For given userId/questionId, only the most recent recommendation action is stored
    const byUser = {};
    allRecommendations.forEach(recommendation => {
        let byQuestion = byUser[recommendation.userId];
        if (!byQuestion){
            byQuestion = {};
            byUser[recommendation.userId] = byQuestion;
        }
        let mostRecent = byQuestion[recommendation.questionId];
        if (mostRecent){
            if (recommendation.date > mostRecent.date) {
                mostRecent = recommendation;
            } 
        }
        else {
            mostRecent = recommendation
        }
        byQuestion[recommendation.questionId] = mostRecent;
    })

    // Now flatten it back out
    const prunedSet = [];
    Object.keys(byUser).forEach(userId => {
        const byQuestion = byUser[userId];
        Object.keys(byQuestion).forEach(questionId => {
            prunedSet.push(byQuestion[questionId]);
        })
    })
 
    return prunedSet;
}

const saveUserRatingAction = (state, action) => {
    
    const practitionerId = action.recommendation.practitionerId;
    const userId = action.recommendation.userId;
    let allRecommendations = {...state.allRecommendations};
    
    // An existing Practitioner will have at least an empty recommendation list.
    // A Practitioner who has just been created, and for whom the user has
    // not yet selected any evaluation answers will not
    let isReplacement = false;
    let forThisPractitioner = allRecommendations[practitionerId];
    if (!forThisPractitioner){
        forThisPractitioner = [];
    }
    // Look for a rating action by the current user with matching questionId
    for (let i = 0; i < forThisPractitioner.length; i++){
        const recommendation = forThisPractitioner[i];
        if (recommendation.actionType === 'RATE' 
        && recommendation.userId === userId 
        && recommendation.questionId === action.recommendation.questionId){
            isReplacement = true;
            // Existing id may be undefined if this is just a change the answer 
            // to a question that was first answered before being previously saved
            action.recommendation.id = recommendation.id;
            recommendation.value = action.recommendation.value;
            break;
        }
    }
    // If not replacement of an old value, add it
    if (!isReplacement){
        forThisPractitioner.push(action.recommendation)
    }
    allRecommendations[practitionerId] = forThisPractitioner;
    
    // Now re-calculate all user actions
    const allActionsAndAnswers = findUserActionsAndAnswers(userId, forThisPractitioner);

    // Save new user actions for later transmission to server.
    const queuedUserRatings = {...state.queuedUserRatings}; 
    queuedUserRatings[action.recommendation.questionId] = action.recommendation;

    return {
        ...state,
        allRecommendations: allRecommendations,
        userActions: allActionsAndAnswers.userActions,
        userAnswers: allActionsAndAnswers.userAnswers,
        allAnswers: allActionsAndAnswers.allAnswers,
        queuedUserRatings: queuedUserRatings
    };
}

const storeRatingActionIds = (state, action) => {
    // Does not need to be immutable,because ids have no effect on UI
    const idArray = action.idArray;
    const ratings = action.ratings;

    for (let i = 0; i < ratings.length; i++){
        state.userAnswers[ratings[i].questionId].id = idArray[i];
    }
    return {
        ...state,
        queuedUserRatings: {}
    }
}
    
/** 
* Finds all actions by a given user, and all rating actions from within
* the actions
* @param userId
* @param allActions all recommnedationActions for a practitioner
* @return {userActions, userAnswers, allAnswers}
*/
const findUserActionsAndAnswers = (userId, allActions) => {
    // Find all actions by the user
    const userActions = allActions.filter(action =>{
        return action.userId === userId 
    });
    
    // Find all answers by the user, and convert it to a map of questionId to question
    const userAnswers = userActions.filter(action =>{
        return action.actionType = 'RATE' 
    })
    .reduce((map, answer) => {
        map[answer.questionId] = answer;
        return map;
    }, {})

    // Convert all answers by all users into a map of question id to an array of answer values 
    const allAnswers = allActions.reduce((map, recommendation) => {
        if (!map[recommendation.questionId]){
            map[recommendation.questionId] = [];
        }
        if (recommendation.value || recommendation.value === 0){
            map[recommendation.questionId].push(recommendation.value);
        }
        return map;
    }, {});
    
    return {
        userActions,
        userAnswers,
        allAnswers
    }
}

const clearAllRatings = state => {
    return {
        ...state,
        userActions: [],
        userAnswers: {},
        queuedUserRatings: {},
        allAnswers: {}
    }
}
        
export default evaluationReducer;