/**
 * Implements the MyActivity View
 */
import React, { Component } from 'react';
import Instructions from '../components/Instructions';
import { connect } from 'react-redux';
import axios from 'axios';
import { mapIdsToEntities } from '../common/utilities';
import Activity from '../components/Activity';
import { Panel, Button } from 'react-bootstrap';
import * as actions from '../store/practitionerActions';
import  '../css/myactivity.css';

class MyActivity extends Component {

    state = {
        actions: undefined,         // All actions performed by the user
        practitioners: undefined,   // All the practitioners, mapped by id
        newPractitioners: undefined // Array of practitioners added since the user last logged in
    }

    constructor(props){
        super(props);
        this.state.practitioners = mapIdsToEntities(this.props.allPractitioners);
        this.viewNewPractitioners = this.viewNewPractitioners.bind(this);
    }

    componentDidMount(){
        // Retrieve all actions performed by this user
        axios.get('/actions/?userId=' + this.props.loggedInUser.id)
        .then(response => {
            let actions = response.data;
            if (actions.length > 0){
                actions = actions.sort( (a, b) => {
                    return a.date - b.date;
                });
            }
            this.setState({actions});
        })
        // Determine if any Practitioners have been added since the user last logged in
        const newPractitioners = this.findNewPractitioners();
        if (newPractitioners.length > 0){
            this.props.saveMatchingPractitioners(newPractitioners);
            this.setState({newPractitioners})
        }
    }

    findNewPractitioners(){
        if (!this.props.loggedInUser.lastLogin){
            // First time this user has logged in since the lastLogin field added to User entities
            return []
        }
        console.log(new Date(this.props.loggedInUser.lastLogin))
        return this.props.allPractitioners.filter( practitioner => {
            console.log(new Date(practitioner.creationDate))
            return practitioner.creationDate > this.props.loggedInUser.lastLogin
        }, this)
    }

    viewNewPractitioners(){
        this.props.history.push('/search-results?withMatchingPractitioners=true'); 
    }

    render() {
        if (!this.state.actions || this.state.actions.length === 0){
            return (
            <Instructions width='80%'>
                <p>Welcome to the My Activity page. Here you will see a record of all the actions you have performed, such as:</p>
                <div>
                    <ul className='list'>
                        <li>Add a practitioner to the site</li>
                        <li>Edit practitioner information (address, phone, etc.) previously entered by you or another user</li>
                        <li>Rate a practitioner</li>
                        <li>Comment on a practitioner or respond to a comment by another user</li>
                    </ul>
                </div>
                <p>As of now, you have not performed any actions.</p>
            </Instructions>
            )
        }
        else {
            const types = {
                'CREATE'    : 'Added practitioner ',
                'EDIT'      : 'Edited the information on ',
                'RATE'      : 'Rated ',
                'COMMENT'   : 'Commented about '
            };
            const panelStyle = {
                width:'90%',
                margin: 'auto',
            };

            if (this.state.newPractitioners){
                const length = this.state.newPractitioners.length;
                var message = `${length} ${length === 1 ? 'Practitioner has' : 'Practitioners have'} been added since you last logged in.`
            }
    
            return (
            <div className='activity-panel'>
                {this.state.newPractitioners ? 
                        <div className='new-practitioners'>
                            <div>{message}</div>
                            <Button type='button' className='action btn-sm' onClick={this.viewNewPractitioners}>View New Practitioners</Button>
                        </div>
                    : ''
                }
                <Panel>
                    <Panel.Heading>
                        <Panel.Title toggle>My Activity</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <div>
                        {
                        this.state.actions.map( action => {
                            const date = (new Date(action.date)).toDateString().substring(4);
                            const practitionerName = this.state.practitioners[action.practitionerId].firstName + ' ' 
                                + this.state.practitioners[action.practitionerId].lastName + '. ';
                            const type = action.actionType;
                            const description = types[type].concat(practitionerName);
                            return <Activity type={action.type} date={date} description={description} key={action.id}/>
                        })
                        }
                        </div>
                    </Panel.Body>
                </Panel>
            </div>
            )
        }
    }
}

const mapStateToProps = state => {
    return {
        loggedInUser: state.userReducer.loggedInUser,
        allPractitioners: state.practitionersReducer.allPractitioners
     }
}

const mapDispatchToProps = dispatch => {
    return {
        saveMatchingPractitioners: (matchingPractitioners) => dispatch({ type: actions.SAVE_SEARCH_RESULTS, matchingPractitioners }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyActivity);