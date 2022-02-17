/**
 * Implements the Practitioner List view. 
 * <p>
 * The list may contain all the Practitioners in the system (by selecting the View All menu) 
 * or just those those matching search criteria. If the search included distance calculation, 
 * the path includes the parameter 'withDistance' In this case, the initial sort order will be
 * on the distance field. 
 * </p>
 * <p>
 * If the path includes a 'withMatchingPractitioners' parameter, the "matchingPractitioners" array
 * in the Redux store is listed, rather than its list of all practitioners 
 * </p>
 * 
 * <p>The user can also sort on Name, Phone or Specialty</p>
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import PractitionerListItem from '../components/PractitionerListItem';
import { STORE_COMMENTS } from '../store/commentActions';
import { STORE_ALL_RECOMMENDATION_ACTIONS} from '../store/evaluationActions';
import { Button } from 'react-bootstrap';

class PractitionerList extends Component {

    state = {}

    constructor(props){
        super(props);

        if (props.location.search){
            // Arrived here after a search
            const queryParams = new URLSearchParams(this.props.location.search);
            this.state.withDistance = queryParams.get('withDistance');
            this.state.withMatchingPractitioners = queryParams.get('withMatchingPractitioners');
        }
        else {
            // Arrived from the The View All menu item does not deliver any search params
            this.state.withDistance = false;
            this.state.sortColumn = 'Name';
        }
        this.state.showRecommendButton = false | this.props.loggedInUser

        this.sort = this.sort.bind(this);
    }

    componentDidMount() {
        let practitioners;
        if (this.state.withMatchingPractitioners){
            // Practitioners to be displayed were passed from the search page
            practitioners = this.props.matchingPractitioners
        }
        else {
            // All practitioners from the Redux store are to be displayed
            practitioners = this.props.allPractitioners
        }
        const sortColumn = this.state.withDistance ? 'Distance' : 'Name'
        this.doSort(sortColumn, practitioners);
    }

    doSort(field, practitioners){
        this.setState({sortColumn: field});
        field = field.charAt(0).toLowerCase().concat(field.substring(1));
        
        if (field === 'name') field = 'lastName';
        
        const sorted = [...practitioners].sort( (a, b) => {
        if (field === 'distance'){
                if (a.distance.inMeters === -1){
                    return -1;
                }
                return a.distance.inMeters - b.distance.inMeters;
            }
            else {
                return a[field] ? a[field].localeCompare(b[field]) : -1;
            }
        });

        this.setState({
            practitioners: sorted
        })
    }

    sort(event){
        this.doSort(event.target.id, this.state.practitioners);
    }

    render(){
        if (!this.state.practitioners){
            return (<></>)
        }
        return (
        <>
            {this.props.loggedInUser ?
                <Button type="button" key='1' className='button-large' onClick={this.recommend}>
                    Recommend a Practitioner
                </Button>
                : ''
            }
            <div style={{paddingTop: '0.5em', paddingBottom: '0.5em', paddingLeft: '10%', display: 'flex', alignItems:'left', fontWeight: 'bold'}}>
                {this.state.practitioners.length}&nbsp;{this.state.practitioners.length === 1 ? 'Practitioner' : 'Practitioners'} Found
            </div>
            <table>
                <thead>
                    <tr>
                        <th id="Name" onClick={this.sort}>
                            Name{this.state.sortColumn === 'Name' ? <span className="fas fa-caret-down fa-lg"></span>:''}
                        </th>
                        <th id="Address">Address</th>
                        <th id="City" onClick={this.sort}>
                            City{this.state.sortColumn === 'City' ? <span className="fas fa-caret-down fa-lg"></span>:''}
                        </th>
                        <th id="Province" onClick={this.sort}>
                            Province{this.state.sortColumn === 'Province' ? <span className="fas fa-caret-down fa-lg"></span>:''}
                        </th>
                        <th id="Code"></th>
                        <th id="Phone" onClick={this.sort}>
                            Phone{this.state.sortColumn === 'Phone' ? <span className="fas fa-caret-down fa-lg"></span>:''}
                        </th>
                        <th id="Specialty" onClick={this.sort}>
                            Specialty{this.state.sortColumn === 'Specialty' ? <span className="fas fa-caret-down fa-lg"></span>:''}
                        </th>
                        {this.state.withDistance ? 
                            <th id="Distance" onClick={this.sort}>
                                Distance{this.state.sortColumn === 'Distance' ? <span className="fas fa-caret-down fa-lg"></span>:''}
                            </th>
                            : ''
                        }
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.practitioners.map((practitioner, index) => {
                        return <PractitionerListItem 
                            practitioner={practitioner} 
                            select={(id) => this.selectHandler(id)} 
                            key={practitioner.id} />
                    }, this)}
                </tbody>
            </table>
        </>
        )
    }

    //Responds to the the "Recommend a Pratitioner" button
    recommend = () => {
        // Go to the Practitioner View. The negative id value in 
        // the path signifies a practitioner is being created    
        this.props.history.push('/practitioners/-1');
    }

    // Handles selection of a Practitioner in a child PractitionerListItem component
    selectHandler(practitionerId) {
        const userId = this.props.loggedInUser ? this.props.loggedInUser.id : null;

        // The Practitioner may have been selected before, so only fetch actions
        // or comments if they were not previously fetched 
        // Fetch all the recommendation actions for this practitioner
        axios.get('/actions/' + practitionerId)
        .then(response => {
            this.props.storeAllRecommendationActions(response.data, practitionerId, userId);
        })
        .then(() => {
            // Fetch all the comments on this practitioner
            // TODO Figure out how to perform either or both fetches concurrently
            return axios.get('/comments/' + practitionerId)
        })
        .then(response => {
            if (response.data){
                this.props.storeComments(response.data, practitionerId);
            }
        })
        .then(() => {
            // Go to the Practitioner View      
            this.props.history.push('/practitioners/' + practitionerId);
        });
    }
}

const mapStateToProps = state => {
    return {
        allPractitioners: state.practitionersReducer.allPractitioners,
        matchingPractitioners: state.practitionersReducer.matchingPractitioners,
        specialties: state.practitionersReducer.specialties,
        loggedInUser: state.userReducer.loggedInUser,
        allRecommendations: state.evaluationReducer.allRecommendations
    }
}

const mapDispatchToProps = dispatch => {
    return {
        storeAllRecommendationActions: (allRecommendations, practitionerId, userId) => dispatch({ 
            type: STORE_ALL_RECOMMENDATION_ACTIONS, 
            allRecommendations: allRecommendations, 
            practitionerId: practitionerId,
            userId: userId 
        }),
        storeComments: (comments, practitionerId) => dispatch({ 
            type: STORE_COMMENTS, 
            comments: comments, 
            practitionerId: practitionerId 
        })

    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PractitionerList))
