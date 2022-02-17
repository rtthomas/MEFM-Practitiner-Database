import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Banner from './components/Banner';
import CopyUrl from './containers/CopyUrl';
import RefreshWarning from './components/RefreshWarning';
import Instructions from './components/Instructions';
import Home from './containers/Home';
import Footer from './containers/Footer';
import MyActivity from './containers/MyActivity';
import PendingComments from './containers/PendingComments';
import PractitionerList from './containers/PractitionerList';
import Practitioner from './containers/Practitioner';
import NewPractitioner from './components/NewPractitioner';
import Search from './containers/Search';
import SignIn from './containers/SignIn';
import SignOut from './containers/SignOut';
import Moderators from './containers/Moderators';
import ResetRequest from './containers/ResetRequest';
import './App.css';
import Radium, {StyleRoot} from 'radium';
import { CircleSpinner } from "react-spinners-kit";
import * as practitionerActions from './store/practitionerActions';
import * as userActions from './store/userActions';
import * as evaluationActions from './store/evaluationActions';
import * as locationActions from './store/locationActions';
import axios from 'axios';
import { fetchStaticEntities } from './entityFetcher';

/**
 * The root component of the application. It displays the menu, whose
 * item set is determined by whether a user is logged in, and the type of user 
 */
class App extends Component {
    
    SESSION_MINUTES = 15;
    state = {hasError: false};

    constructor(props){
        super(props);
        console.log('constructor: pathname = ' + this.props.history.location.pathname);
        // Add axios interceptors
        axios.interceptors.request.use(request => {
            this.setState({
                requestUrl: request.url,
                requestData: request.data
            });
            return request;
        }, error => {
            console.log(error);
            return Promise.reject(error);
        });
        // Session timeout is based on the user not performing an
        // action which requires a server request 
        axios.interceptors.response.use(response => {
            this.restartSessionTimer(this.SESSION_MINUTES);
            return response;
        }, error => {
            this.restartSessionTimer(this.SESSION_MINUTES);
            console.log(error);
            if (error.response){
                if (error.response.status !== 401 && error.response.status !== 403){
                alert('An error has occurred. Please report this information:\n'
                    + 'Status = ' + error.response.status
                    + '\nURL = ' + this.state.requestUrl
                    + '\ndata = ' + JSON.stringify(this.state.requestData));
                }
            }
            else {
                alert('There was a problem connecting to the server\n'
                    + 'Try closing your browser and try again');
            }
            return Promise.reject(error);
        });

        const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
        if (isChrome){
            // First check if the warning has been given before. For now, this will
            // be unconditional, i.e. not date stamped and compared
            const key = 'chrome-was-shown';
            if (!localStorage.getItem(key)){
                this.state.showChromeWarning = true;
                localStorage.setItem(key, 'true');
            }
        }
        this.onCloseWarning = this.onCloseWarning.bind(this);
        this.showUrlPopup = this.showUrlPopup.bind(this);
        this.hideUrlPopup = this.hideUrlPopup.bind(this);
        
        this.state.loading = true;
    }

    onCloseWarning(){
        this.setState({showChromeWarning: false})
    }

    /**
     * Restarts the session timer
     * @param sessionLimit the session limit in minutes
     */
    restartSessionTimer(sessionLimit) {
        if (this.timerId){
            clearTimeout(this.timerId);
        }
        this.timerId = setTimeout(() => {
            if (this.props.loggedInUser){
                // Session timing applies only to logged in users
                this.props.history.push('/sign-out');
            }
        }, sessionLimit * 60000);        
    }

    componentDidMount() {
        fetchStaticEntities(this.props)
        .then( () => {
            this.setState({loading: false});
            this.props.history.replace('/home');
        })
        // TODO: Replace with user friendly response
        .catch(error => {
            console.log(error);
        })        
    }
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }
    
    componentDidCatch(error, info) {
        console.log(error);
        console.log(info);
        // Report error to server for logging
        axios.post('/errors', {
            error: JSON.stringify(error),
            info: JSON.stringify(info)
        });
    }

    // Displays the CopyUrl popup component
    showUrlPopup(){ 
        this.setState({ showUrlPopup: true }) 
    }
    // Hides the CopyUrl popup component
    hideUrlPopup(){ 
        this.setState({ showUrlPopup: false });
        // When the CopyUrl component is shown, the url will lose the current location.
        // Need to explicitly go back. Presumably this is required because the event triggering
        // the CopyUrl display is within the Navbar
        this.props.history.goBack(); 
    }
    
    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <Instructions>
                    <p>Ooops! Something went wrong. Sorry about that</p>
                    <p>Please close your browser and start again. </p>
                 </Instructions>
            )
        }
      
        // Display spinner until all required data are obtained from the server 
        if (this.state.loading){
            return (
                <div className='spinner-container'>
                    <CircleSpinner size={80} color="#686769" loading={this.state.loading}></CircleSpinner>
                </div>
            )
        }

        if (this.state.showChromeWarning) {
            return <RefreshWarning onClose={this.onCloseWarning}/>
        }

        // Establish routes according to whether the user is logged in, and if so,
        // what the user's role is. 
       
        const active = this.props.loggedInUser && !this.props.loggedInUser.isModerator && !this.props.loggedInUser.isAdministrator;
        const moderator = this.props.loggedInUser && this.props.loggedInUser.isModerator;
        const administrator = this.props.loggedInUser && this.props.loggedInUser.isAdministrator;

        let routes;
        if (moderator){
            routes = (
                <>
                <Route path="/search" component={Search} />
                <Route path="/practitioners" exact component={PractitionerList} />
                <Route path="/search-results" component={PractitionerList} />
                <Route path="/practitioners/:id" exact component={Practitioner} />
                <Route path="/new-practitioner" exact component={NewPractitioner} />
                <Route path="/pending-comments" component={PendingComments} />
                <Route path="/home" component={Home} />
                <Route path="/sign-in" component={SignIn} />
                <Route path="/sign-out" component={SignOut} />
                </>
            );
        }
        else if (administrator){
            routes = (
                <>
                <Route path="/sign-in" component={SignIn} />
                <Route path="/sign-out" component={SignOut} />
                <Route path="/manage-moderators" component = {Moderators} />
                <Route path="/home" component={Home} />
                </>
            );
        }
        else if (active) { 
            routes = (
                <>
                <Route path="/search" component={Search} />
                <Route path="/practitioners" exact component={PractitionerList} />
                <Route path="/search-results" component={PractitionerList} />
                <Route path="/new-practitioner" exact component={NewPractitioner} />
                <Route path="/practitioners/:id" exact component={Practitioner} />
                <Route path="/my-activity" component={MyActivity} />
                <Route path="/home" component={Home} />
                <Route path="/sign-in" component={SignIn} />
                <Route path="/sign-out" component={SignOut} />
                </>
            );
        }
        else {
            routes = (
                <>
                <Route path="/home" component={Home} />
                <Route path="/search" component={Search} />
                <Route path="/practitioners" exact component={PractitionerList} />
                <Route path="/sign-in" component={SignIn} />
                <Route path="/search-results" component={PractitionerList} />
                <Route path="/practitioners/:id" exact component={Practitioner} />
                <Route path="/reset-request" component={ResetRequest} />
                </>
            );
        }

        // Render the menu consistent with the routes established above.
        // Technical note: The react-router-bootstrap LinkContainer accepts 
        // the same parameters as react-router NavLink and Link
        return (
            <StyleRoot>
            <div className="App">
                <Banner/>
                <Navbar collapseOnSelect style={navbarHeight}>
                    <Navbar.Header>                        
                        <a className='copy-url' href='#' style={{color: '#ffffff'}} onClick={this.showUrlPopup}>Share</a>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    
                    <Navbar.Collapse>
                    
                        <Nav pullRight>
                            <LinkContainer to="/home">
                                <NavItem>Home</NavItem>
                            </LinkContainer>

                            {administrator ?
                                <LinkContainer to="/manage-moderators">
                                    <NavItem>Moderators</NavItem>
                                </LinkContainer>
                                :
                                <>
                                <LinkContainer to="/practitioners">
                                    <NavItem>View All</NavItem>
                                </LinkContainer>
                                <LinkContainer to="/search">
                                    <NavItem>Search</NavItem>
                                </LinkContainer>
                                </>
                            }
                            {active || moderator ?
                                <LinkContainer to="/new-practitioner">
                                    <NavItem>Recommend</NavItem>
                                </LinkContainer>
                                : ''
                            }
                            {active ?
                                <LinkContainer to="/my-activity">
                                    <NavItem>My Activity</NavItem>
                                </LinkContainer>                                
                                : ''
                            }
                            {moderator ?
                                <LinkContainer to="/pending-comments">
                                    <NavItem>Comments</NavItem>
                                </LinkContainer>
                                : ''
                            }

                            {active || moderator || administrator ?
                                <LinkContainer to="/sign-out">
                                    <NavItem>Signout</NavItem>
                                </LinkContainer>
                                : 
                                <LinkContainer to="/sign-in">
                                    <NavItem>Sign In/Register</NavItem>
                                </LinkContainer>
                            }
                    </Nav>
                    </Navbar.Collapse>
                </Navbar>
                {active ?
                    <div>
                        <div style={{height: '90%',marginBottom:'10%'}}>
                            {routes}
                        </div>
                        <Footer/> 
                    </div>                               
                    : 
                    <div style={{height: '100%'}}>
                        {routes}
                    </div>                               
                }
            </div>
            {
                this.state.showUrlPopup ? <CopyUrl close={this.hideUrlPopup}/> : null
            }
            </StyleRoot>
        );
    }
}

const navbarHeight = {
    minHeight: '40px !important',
    maxHeight: '40px !important'    
}

const mapStateToProps = state => {
    return {
        loggedInUser: state.userReducer.loggedInUser,
        moderators: state.userReducer.moderators
    }
}

const mapDispatchToProps = dispatch => {
    return {
        storeUsers: (users) => dispatch({ type: userActions.STORE_ALL_USERS, users }),
        storeModerators: (moderators) => dispatch({ type: userActions.STORE_MODERATORS, moderators }),
        storeSpecialties: (specialties) => dispatch({ type: practitionerActions.STORE_SPECIALTIES, specialties }),
        storeProvinces: (provinces) => dispatch({ type: locationActions.STORE_PROVINCES, provinces }),
        storeCities: (cities) => dispatch({ type: locationActions.STORE_CITIES, cities }),
        storeQuestions: (questions) => dispatch({ type: evaluationActions.STORE_QUESTIONS, questions }),
        storeQuestionChoices: (questionChoices) => dispatch({ type: evaluationActions.STORE_QUESTION_CHOICES, questionChoices }),
        storeQuestionGroups: (questionGroups) => dispatch({ type: evaluationActions.STORE_QUESTION_GROUPS, questionGroups }),
        storePractitioners: (practitioners) => dispatch({ type: practitionerActions.STORE_PRACTITIONERS, practitioners: practitioners })
    }
}

export default Radium(withRouter(connect(mapStateToProps, mapDispatchToProps)(App)));

    