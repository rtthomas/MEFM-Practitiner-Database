/**
 * This reducer deals with all states related to users and moderators
 */
import * as actions from './userActions';

const initialState = {
    allUsers: [],
    moderators: [],
    loggedInUser: null
}

const userReducer = (state = initialState, action) => {
    switch (action.type){
        case actions.STORE_LOGGED_IN_USER : return storeLoggedInUser(action.user, state);
        case actions.STORE_ALL_USERS : return storeAllUsers(action.users, state);
        case actions.LOGOUT : return logout(state);
        case actions.STORE_NEW_USER : return storeNewUser(action.user, state);
        case actions.STORE_MODERATORS: return storeModerators(action.moderators, state);
        case actions.SAVE_MODERATOR: return saveModerator(action.moderator, state);

        default: return state;
    }
}

const storeLoggedInUser = (user, state) => {
    // If the user is a Moderator, add an "isModerator" property]
    user.isModerator = user.role === 'MODERATOR';
    user.isAdministrator = user.role === 'ADMINISTRATOR';
    // This may be a user who has just been created.
    const allUsers = checkAndAddNewUser(user, state.allUsers);
    return {
        ...state,
        loggedInUser: user,
        allUsers
    }   
}

// If the logged in user is not in the user map, he/she is new: add to map
const checkAndAddNewUser = (user, allUsers) => {
    if (allUsers[user.id]){
        return allUsers;
    }
    const newAllUsers = {...allUsers}
    newAllUsers[user.id] = user;
    return newAllUsers;
}

const storeAllUsers = (users, state) => {
    const allUsers = users.reduce((map, user) => {
        map[user.id] = user;
        return map
    }, {});
    return {
        ...state,
        allUsers
    }
}

const logout = (state) => {
    return {
        ...state,
        loggedInUser: null
    }
}

const storeModerators = (moderators, state) => {
    // Map by user id
    const map = moderators.reduce((map, moderator) => {
        map[moderator.userId] = moderator;
        return map
    }, {});
    return {
        ...state,
        moderators: map
    }
}

const storeNewUser = (user, state) => {
    // This is for the User account of a Moderator created by the Administrator
    user.isModerator = true;
    const allUsers = {...state.allUsers};
    allUsers[user.id] = user;
    return {
        ...state,
        allUsers
    }
}

const saveModerator = (moderator, state) => {
    // This is for the User account of a Moderator created by the Administrator
    const moderators = {...state.moderators};
    moderators[moderator.userId] = moderator;
    return {
        ...state,
        moderators
    }
}

export default userReducer;