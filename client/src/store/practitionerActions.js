/**
 * Actions associated with practition creation, editing, evaluation, and commenting
 */
import axios from 'axios';

/******* Synchronous actions *********/
export const STORE_PRACTITIONERS = 'STORE_PRACTITIONERS';
export const STORE_SPECIALTIES = 'STORE_SPECIALTIES';
export const UPDATE_PRACTITIONER = 'UPDATE_PRACTITIONER';
export const CREATE_PRACTITIONER = 'CREATE_PRACTITIONER';
export const SAVE_SEARCH_RESULTS = 'SAVE_SEARCH_RESULTS';

/******* Asynchronous actions ********/

/**
 * Sends an updated practitioner to the server then dispatches to the store
 * @param {*} practitioner 
 */
export const updatePractitioner = (practitioner, userId) => {
    practitioner.editDate = new Date().getTime();
    return dispatch => {
        axios.put('/practitioners/' + practitioner.id + '?userId=' + userId, practitioner)
            .then(() => {
                dispatch({ type: UPDATE_PRACTITIONER, practitioner: practitioner })
            }
        );        
    }
};



