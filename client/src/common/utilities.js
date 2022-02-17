/**
 * Common utility functions
 */

 /**
  * Manages keystrokes entered in a postal code field. The purpose is
  * to coerce the value into the format 'V0V-0V0'
  * @param value the value of the entry field after the keystroke
  * @return the postal code field after the rules have been applied
  */
export const handlePostalCode = value =>{
    value = value.toUpperCase();
    if (value.endsWith(' ')){
        value = value.replace(' ','-');
    }
    if (value.length === 4){
        if (value.charAt(3) !== '-'){
            value = value.substring(0, 3) + '-' + value.charAt(3);
        }
    }
    else if (value.length === 6 && value[3] !== '-'){
        // User has pasted postal code with neither blank nor dash
        value = value.substring(0, 3) + '-' + value.substring(3, 6)
    }
    else if (value.length === 7){
        // User pasted postal code with blank
        value = value.replace(' ','-');
    }
    else if (value.length === 8){
        value = value.substring(0, 7);
    }
    return value
}

/**
  * Manages keystrokes entered in last or first name field. The purpose is to coerce the value 
  * into Camel Case. (Google Datastore does not support case insenstive search)
  * @param value the value of the entry field after the keystroke
  * @return the postal code field after the rules have been applied
  */
  export const camelCase = value => {
    return value.length === 0 ? '' 
        : value[0].toUpperCase() + (value.length > 1 ? value.substring(1).toLowerCase() : '');
  }
    
/**
  * Manages keystrokes entered in a phone number field. The purpose is
  * to coerce the value into the format '(111)222-3333'
  * @param value the value of the entry field after the keystroke
  * @return the postal code field after the rules have been applied
  */
  export const handlePhoneNumber = value => {
    // First check if user has pasted a string in the wrong format
    if (value.length > 1 && value[0] !== '('){
        // Strip out everything except digits
        if (value[0] === '1'){
            // Remove leading 1
            value = value.substring(1);
        }
        // Remove all characters except first ten digits
        value = value.replace(/\D/g, "");
        value = value.substring(0,10);
        value = '(' + value.slice(0,3) + ')' + value.slice(3,6) + '-' + value.slice(6,10)
        return value;
    }
    
    const newChar = value[value.length - 1];
    if (newChar === ' '){
        switch (value.length) {
            case 1: value = '('; break;
            case 5: value = value.substring(0, 4) + ')'; break;
            default: value = value.substring(0, value.length);
        } 
    }
    else if (newChar === '('){
        value = value.length === 1 ? value : value.substring(0, value.length - 1)
    }
    else if (newChar === ')'){
        value = value.length === 5 ? value : value.substring(0, value.length - 1)
    }
    else if (newChar === '-'){
        value = value.length === 9 ? value : value.substring(0, value.length - 1)
    }
    else if (0 <= newChar && newChar <= 9){
    // eslint-disable-next-line
            switch (value.length){
            case 1: value = '(' + value; break;
            case 5: value = value.substring(0, value.length - 1) + ')' + newChar; break;
            case 9: value = value.substring(0, value.length - 1) + '-' + newChar; break;
            case 14: value = value.substring(0, value.length - 1); 
        }
    }
    else {
        value = value.substring(0, value.length - 1)
    }
    return value
}
 /**
 * Given an array of entities, creates a map of the entity id to the the entity's
 * index in the array. 
 * @param entityArray an array of entity objects
 * @return the map 
 */
export const mapIdsToIndices = entityArray => {
    const map = {};
    entityArray.forEach((entity, index) => {
        map[entity.id] = index;
    });
    return map;
}

 /**
 * Given an array of entities, creates a map of the entity id to the the entity 
 * @param entityArray an array of entity objects
 * @return the map 
 */
export const mapIdsToEntities = entityArray => {
    if (!entityArray || entityArray.length === 0){
        return {};
    }
    return entityArray.reduce((map, entity) => {
        map[entity.id] = entity;
        return map;
    }, {});
}

/**
 * Translates the dimension string argument defined for form fields
 * @param dimensions the dimensions string
 */
export const parseDimensions = dimensions => {
    if (dimensions) {
        const d = dimensions.split(',');
        return {
            labelWidth: 'col-sm-' + d[0],
            valueWidth: 'col-sm-' + d[1],
            labelOffset: 'col-sm-offset-' + d[3] 
        }
    }
    else return {
        labelWidth: 'col-sm-3',
        valueWidth: 'col-sm-9',
        labelOffset: 'col-sm-offset-0' 
    }
}

/**
 * Determines the base URI of the application
 * @return the value
 */
export const getBaseURI = () => {
    let baseURI = document.baseURI;
    if (!baseURI) {
        // For IE
        baseURI = window.location.href;
    }
    return baseURI;
}

/**
 * Checks that a string is a valid email address 
 */
export const isValidEmail = ( s => {
    // eslint-disable-next-line
    return s.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
    // return s.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
    // return s.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
//    return s.match("/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/");
})

