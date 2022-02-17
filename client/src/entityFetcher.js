import axios from 'axios';

/**
 * Fetches all static entities from either the browser local storage or from the server
 * @param {*} props 
 */
export const fetchStaticEntities = (props) => {
    const entityBlocks = {
        'Province':       {type: 'Province',      path:'/provinces',       isDirty: true, redux: props.storeProvinces},
        'Moderator':      {type: 'Moderator',     path:'/moderators',      isDirty: true, redux: props.storeModerators},
        'User':           {type: 'User',          path:'/users',           isDirty: true, redux: props.storeUsers},
        'Specialty':      {type: 'Specialty',     path:'/specialties',     isDirty: true, redux: props.storeSpecialtys},
        'Question':       {type: 'Question',      path:'/questions',       isDirty: true, redux: props.storeQuestions},
        'QuestionChoice': {type: 'QuestionChoice',path:'/questionchoices', isDirty: true, redux: props.storeQuestionChoices},
        'QuestionGroup':  {type: 'QuestionGroup', path:'/questiongroups',  isDirty: true, redux: props.storeQuestionGroups},
        'Practitioner':   {type: 'Practitioner',  path:'/practitioners',   isDirty: true, redux: props.storePractitioners},
        'City':           {type: 'City',          path:'/cities',          isDirty: true, redux: props.storeCities}
    }
    return new Promise(function (resolve, reject) {   
        axios.get('/versions')
        .then(versions => {
            // Only Specialty, Question, QuestionChoice, QuestionGroup and City entities 
            const serverVersions = versions.data;  // Array of {entityType, version}

            const localVersions = fetchLocal('Versions')
            storeLocal('Versions', serverVersions)

            if (localVersions) { // map of all version types to version number
                // Local storage was initialized previously in the browser
                markDirtyTypes(serverVersions, localVersions, entityBlocks);
            }
            const promises = []
            Object.values(entityBlocks).forEach(entityBlock => {
                promises.push(fetchLocalOrRemote(entityBlock))
            })
            return Promise.all(promises)
        })
        .then(([
            provinces,moderators,users,specialties,questions,questionchoices,questiongroups,practitioners,cities
            ]) => {
                storeThem(props, {
                provinces,moderators,users,specialties,questions,questionchoices,questiongroups,practitioners,cities,
            });
            resolve()
        })
    });
}

const storeThem = (props, all) => {
    let data
    data = all.provinces.data;                                              props.storeProvinces        (data);
    data = all.moderators.data;                                             props.storeModerators       (data);
    data = all.users.data;                                                  props.storeUsers            (data);
    data = all.specialties.data;     storeLocal('Specialty', data);         props.storeSpecialties      (data);
    data = all.questions.data;       storeLocal('Question', data);          props.storeQuestions        (data);
    data = all.questionchoices.data; storeLocal('QuestionChoice', data);    props.storeQuestionChoices  (data);
    data = all.questiongroups.data;  storeLocal('QuestionGroup', data);     props.storeQuestionGroups   (data);
    data = all.practitioners.data;                                          props.storePractitioners    (data);
    data = all.cities.data;          storeLocal('City', data);              props.storeCities           (data);
}

const fetchLocalOrRemote = entityBlock => {
    if (entityBlock.isDirty) {
        return axios.get(entityBlock.path);
    }
    else {
        const response = {data: fetchLocal(entityBlock.type)}
        return new Promise(function (resolve, reject) {
            resolve(response)
        });
    }
}

const markDirtyTypes = (serverVersions, localVersions, entityBlocks) => {
    for (var i = 0; i < serverVersions.length; i++){
        const type = localVersions[i].entityType; 
        if(localVersions[i].version === serverVersions[i].version){
            entityBlocks[type].isDirty = false;
        }
    }
}
const storeLocal = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
}
const fetchLocal = key => { 
    return JSON.parse(localStorage.getItem(key))
}

/** Unconditionally fetches cities from thge server */
export const fetchCities = (storeCities) => {
    axios.get('/cities')
    .then (cities => {
        storeLocal('City', cities.data);           
        storeCities(cities.data);
    })

}