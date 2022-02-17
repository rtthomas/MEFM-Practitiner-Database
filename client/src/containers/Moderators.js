/**
 * An administrator uses this view to assign moderators to regions (e.g. in Canada, a province,)
 * and to disable a moderator. Only one active (non suspended) moderator is allowed per province 
 */
import React, { Component } from 'react';
import { PanelGroup, Panel } from 'react-bootstrap';
import { connect } from 'react-redux';
import NewModerator from '../components/NewModerator';
import ModeratorList from '../components/ModeratorList';
import Instructions from '../components/Instructions';
import axios from 'axios';
import * as actions from '../store/userActions';
import { STORE_CITIES }from '../store/locationActions';
import { CircleSpinner } from "react-spinners-kit";
import { fetchCities } from '../entityFetcher';

class Moderators extends Component {

    state = {};

    constructor(props){
        super(props);

        this.state.moderator = {
            province: '',
            url: ''
        }
        this.state.user = {
            username: '',
            password: '',
            confirmPassword: '',
            email: '',
            role: 'MODERATOR'
        }
        
        this.createModerator = this.createModerator.bind(this);
        this.onChange = this.onChange.bind(this);
        this.selectProvince = this.selectProvince.bind(this);
        this.switchStatus = this.switchStatus.bind(this);
    }

    onChange = (event) => {
        this.setState({errorMessage: null});
        const {name, value} = event.target;
        if (name === 'url'){
            const moderator = { ...this.state.moderator }
            moderator[name] = value;
            this.setState({
                moderator
            });

        }
        else {
            const user = { ...this.state.user }
            user[name] = value;
            this.setState({
                user
            });
        }
    }

    selectProvince = (event) => {
        this.setState({moderator: {province: event.value}});
    }

    createModerator(){
        // First create the user account
        axios.post('/users', this.state.user)
        .then(response => {
            if (response.data.nameAlreadyTaken){
                this.setState({errorMessage: "That username is already taken. Please enter a new value"});
            }
            else if (response.data.emailAlreadyTaken){
                this.setState({errorMessage: "That email address is already in use by another user. Please enter a new value"});
            }
            else {
                // Store in Redux
                const user = {...this.state.user, id: response.data}
                this.props.saveNewModeratorUser(user)
                
                // Now create the moderator
                const moderator = {...this.state.moderator, userId: response.data, status: 'ENABLED'}
                this.props.saveNewModerator(moderator);
                
                // Remove the moderator's province from the province list
                const availableProvinces = this.state.availableProvinces.filter( province => province.name !== moderator.province)

                this.setState({
                    user: {
                        username: '',
                        password: '',
                        confirmPassword: '',
                        email: '',
                        role: 'MODERATOR'
                    },
                    moderator: {
                        province: '',
                        url: ''
                    },
                    availableProvinces
                });
                // When a moderator is created, the cities must be refetched. Otherwise, the browser
                // used by the admin to create the moderator will have no cities until a chaange to the
                // cities lists on the server happen to change. 
                fetchCities(this.props.storeCities);
            }
        })
    }

    /** Switches a moderator status between ENABLED and SUSPENDED */
    switchStatus = (moderator) => {
        const status = moderator.status === 'ENABLED' ? 'SUSPENDED' : 'ENABLED'
        this.props.changeModeratorStatus({...moderator, status})

        // if (moderator.status === 'SUSPENDED'){
        //     // If the corresponding province is not selectable for assigment, it means another 
        //     // moderator for the same province has already been assigned
        //     this.state.availableProvinces.forEach( province => {
        //         if (province === moderator.province) {
        //             // The moderator's province is available for assignment
        //             this.props.changeModeratorStatus({...moderator, status: 'ACTIVE'});
        //             return
        //         }
        //     })
        //     // The moderator's province is unavailable, meaning since the suspension
        //     // another moderator has been created 
        //     this.setState({alreadyExistsMessage: "There already exists a moderator for " + moderator.province});
        // }
        // else {
        //     this.props.changeModeratorStatus({...moderator, status: 'SUSPENDED'})
        //     this.setState({  alreadyExistsMessage: null  });
        // }        
    }

    static getDerivedStateFromProps(props, state) {
        // Restrict the province list to those for whom there is not an active moderator
        let availableProvinces = [...props.provinces];
        Object.keys(props.moderators).forEach( key => {
            const moderator = props.moderators[key]
            if (moderator.status === 'ENABLED'){
                availableProvinces = availableProvinces.filter( province => province !== moderator.province ) 
            }
        })
        return { 
            ...state,
            availableProvinces
        }
    }

    render(){
        // Display spinner until all required data are obtained from the server 
        if (this.state.loading){
            return (
                <div className='spinner-container'>
                    <CircleSpinner size={80} color="#686769" loading={this.state.loading}></CircleSpinner>
                </div>
            )
        }
        const panelStyle = {
            width:'90%',
            margin: 'auto',
        };

        return (
            <>
            <PanelGroup style={panelStyle} accordion id="moderators">
                <Panel eventKey="1">
                    <Panel.Heading>
                        <Panel.Title toggle>Create Moderator Account</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body collapsible>
                        <NewModerator
                            username={this.state.user.username} 
                            password={this.state.user.password} 
                            confirmPassword={this.state.user.confirmPassword} 
                            email={this.state.user.email} 
                            province={this.state.moderator.province}
                            url={this.state.moderator.url}
                            provinces={this.state.availableProvinces}
                            onCreate={this.createModerator}
                            onChange = {this.onChange}
                            onSelect ={this.selectProvince}
                            errorMessage={this.state.errorMessage} />
                    </Panel.Body>
                </Panel>
            </PanelGroup>
            <Panel>
            <div className='vertical-group'>
                <Instructions width='20em'>Moderator List</Instructions>
                <Panel.Body>
                    <ModeratorList moderators = {this.props.moderators} users = {this.props.allUsers} switchStatus = {this.switchStatus}/>
                </Panel.Body>
            </div>
            </Panel>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        provinces: state.locationReducer.provinces,
        allUsers: state.userReducer.allUsers,
        moderators: state.userReducer.moderators
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveNewModeratorUser: user => dispatch({ type: actions.STORE_NEW_USER, user }),
        saveNewModerator: moderator => dispatch(actions.saveModerator(moderator)),
        changeModeratorStatus: moderator => dispatch(actions.changeModeratorStatus(moderator)),
        storeCities: cities => dispatch({ type: STORE_CITIES, cities})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Moderators);
