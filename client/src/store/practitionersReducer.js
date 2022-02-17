/**
 * This reducer deals with all state related to practitioners, 
 * practitioner evaluations and practitioner comments
 */
import * as actions from './practitionerActions';
import { mapIdsToIndices, mapIdsToEntities } from '../common/utilities';

const initialState = {
    allPractitioners: [],
    specialties: null,
    matchingPractitioners: [],
    idsToIndices: {},
    idToPractitioner: {}
}

const practitionersReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.STORE_PRACTITIONERS:   return storePractitioners(state, action.practitioners);
        case actions.STORE_SPECIALTIES:     return storeSpecialties(state, action.specialties);
        case actions.CREATE_PRACTITIONER:   return createPractitioner(state, action.practitioner);
        case actions.UPDATE_PRACTITIONER:   return updatePractitioner(state, action.practitioner);
        case actions.SAVE_SEARCH_RESULTS:   return saveSearchResults(state, action.matchingPractitioners)
        
        default: return state;
    }
};

const storePractitioners = (state, practitioners) => {
    console.log(actions.STORE_PRACTITIONERS)
    // Add the specialty text to each practitioner
    const allPractitioners = practitioners.map((practitioner) => {
        return {
            ...practitioner,
            specialty: state.specialties.idToValue[practitioner.specialtyId]
        }
    });
    // Create a map of practitioner ids to their index in the practitioners array
    const idToPractitioner = mapIdsToIndices(allPractitioners);

    return {
        ...state,
        allPractitioners,
        idsToIndices: mapIdsToIndices(allPractitioners),
        idToPractitioner: mapIdsToEntities(allPractitioners)
    }
}

const storeSpecialties = (state, specialties) => {
    console.log(actions.STORE_SPECIALTIES)
    return {
        ...state,
        specialties: convertSpecialties(specialties)
    }
}

const updatePractitioner = (state, practitioner) => {
    let newState = { ...state };
    const index = newState.idsToIndices[practitioner.id];
    newState.allPractitioners[index] = practitioner;
    return newState;
}

const createPractitioner = (state, practitioner) => {
    let newState = { ...state };
    newState.allPractitioners.push(practitioner);
    newState.idsToIndices[practitioner.id] = newState.allPractitioners.length - 1;
    newState.idToPractitioner[practitioner.id] = practitioner;
    return newState;
}

const saveSearchResults = (state, matchingPractitioners) => {
    return {
        ...state,
        matchingPractitioners
    }
}

const convertSpecialties = (specialtiesIn => {
    // Specialties need to be accessed in three forms - as an array of the
    // specialty text value for use in drop down selectors, as a map 
    // the text value to the specialty id. and vice-versa
    const valueToId = {};
    const idToValue = {}
    const groups = {};

    specialtiesIn.forEach(specialty => {
        valueToId[specialty.text] = specialty.id;
        idToValue[specialty.id] = specialty.text;

        // Separate specialty text into arrays for each group
        let group = groups[specialty.group];
        if (!group){
            group = [];
            groups[specialty.group] = group;
        }
        group.push(specialty.text);
    });

    // Combine them into a the structure compatible with react-select.
    const groupNames = Object.keys(groups);
    const options = [];
    groupNames.forEach( groupName => {
        const group = {label: groupName, options: []}
        options.push(group);
        groups[groupName].forEach( specialtyText => {
            group.options.push({label: specialtyText, value: valueToId[specialtyText]})
        })
    })


    const specialties = {
        options,
        valueToId,
        idToValue
    };
    return specialties;

});

export default practitionersReducer;