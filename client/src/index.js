import 'react-app-polyfill/ie11';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import practitionersReducer from './store/practitionersReducer';
import userReducer from './store/userReducer';
import evaluationReducer from './store/evaluationReducer';
import locationReducer from './store/locationReducer';
import commentReducer from './store/commentReducer';
import App from './App';
import axios from 'axios';
import thunk from 'redux-thunk';
import { getBaseURI } from './common/utilities' 

// Regarding react-app-polyfill/ie11 refer to
// https://github.com/facebook/create-react-app/blob/master/packages/react-app-polyfill/README.md

// Create the store
const rootReducer = combineReducers(
    {
        userReducer: userReducer,
        practitionersReducer: practitionersReducer,
        evaluationReducer: evaluationReducer,
        locationReducer: locationReducer,
        commentReducer: commentReducer
    }
);
    
// Enable Redux devtools Chrome extension, and add thunk middleware (support for asynchronous 
// actions,) per https://github.com/zalmoxisus/redux-devtools-extension#usage
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

axios.defaults.headers.post['Content-Type'] = 'application/json'; // Necessary ?

let baseURI = getBaseURI();
baseURI = baseURI.indexOf('#') > 0 ? baseURI.substring(0, baseURI.indexOf('#')) : baseURI;
// Strip out Facebook bclid parameter that is added to links from a Facebook post
baseURI = baseURI.indexOf('?') > 0 ? baseURI.substring(0, baseURI.indexOf('?')) : baseURI; 
console.log(baseURI);
if (baseURI === "http://localhost:3000/"){
    // Client loaded from VSCode local server 
    axios.defaults.baseURL ="http://localhost:8080/"; 
}
else {
    // Client loaded from local or remote App Engine server
    axios.defaults.baseURL =  baseURI;
}

// This does not work in Chrome
window.addEventListener("beforeunload", function (e) {
    const message = 'WARNING: Refreshing the browser in this application can cause errors.'
        + '\nPlease use the menus to navigate through the application.'
        + 'If you experience problems, enter the original url into your address bar' 
        + '(you will again see this warning, but in that case just accept the reload.)'; 
    this.console.log('beforeunload');
    e.returnValue = message;
    return message;
});

// For some reason things don't kick off unless I have some async code here.
// (Might just be the case for local development ?)
(new Promise(function (resolve, reject) {
    resolve()
})).then(() => {
    ReactDOM.render(app, document.getElementById('root')); 
});

const app = (
    <Provider store={store}>
    <HashRouter>
    <App />
    </HashRouter>
    </Provider>
    );
    