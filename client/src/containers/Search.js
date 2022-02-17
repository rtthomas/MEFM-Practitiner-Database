/**
 * Implements the Search View
 */
import React, { Component } from 'react';
import { Panel, Button } from 'react-bootstrap';
import Selector from '../components/Selector';
import EditableText from '../components/EditableText';
import { connect } from 'react-redux';
import axios from 'axios';
import * as actions from '../store/practitionerActions';
import Instructions from '../components/Instructions';
import { handlePostalCode } from '../common/utilities';
import { CircleSpinner } from "react-spinners-kit";
import { STORE_CITIES }from '../store/locationActions';
import { fetchCities } from '../entityFetcher';

class Search extends Component {

    state = {
        postalCode: '',
        lastName: '',
        firstName: '',
        city: '',
        province: '',
        specialty: '',
        specialtyId: '',
        cityOptions: [],
        MEorFM: undefined        
    };
    CHOICE_EITHER = 'Either ME or FM'
    CHOICE_ME = 'Specifically ME'
    CHOICE_FM = 'Specifically FM'

    MEFM_CHOICES = [
        this.CHOICE_EITHER,
        this.CHOICE_ME,
        this.CHOICE_FM
    ]

    constructor(props){
        super(props);
        this.onChange= this.onChange.bind(this);
        this.onSelectSpecialty = this.onSelectSpecialty.bind(this);
        this.onSelectProvince = this.onSelectProvince.bind(this);
        this.onSelectCity = this.onSelectCity.bind(this);
        this.searchFull = this.searchFull.bind(this);
        this.searchQuick = this.searchQuick.bind(this);
        
        // Province list must be restricted to those for which there is a moderator.
        this.state.availableProvinces = Object.keys(
            Object.values(this.props.moderators).reduce((names, moderator) => {
                names[moderator.province] = '';
                return names;
            }, {})            
        );

        this.confirmCitiesAreLoaded()  
    }
    /** 
     * This check is included only to account for scenarios in which the same browser is being
     * used for combinations of admin and active user sessions
     */
    confirmCitiesAreLoaded(){      
        this.state.availableProvinces.forEach( province => {
            if (!this.props.citiesMap[province]){
                fetchCities(this.props.storeCities);
                return
            }
        })
    }

    onChange = (event) => {     
        let {name, value} = event.target;
        if (name === 'postalCode'){
            value = handlePostalCode(value);
        }
        else if (value.length === 1 && (name === 'lastName' || name === 'firstName')){
            value = value.toUpperCase();
        }
        this.setState({
            [name]: value
        });
    }

    onSelectProvince(event){
        this.setState({province: event.value})
        const cityOptions = this.props.citiesMap[event.value];
        this.setState({
            cityOptions: this.props.citiesMap[event.value],
            errorMessage: null
        })
    }
    onSelectCity(event){
        this.setState({city: event.value})
    }
    onSelectSpecialty(event){
        this.setState({
            specialty: event.label,
            specialtyId: event.value
        })
    }
    onSelectMEorFM(event){
        this.setState({MEorFM: event.value})
    }

    // Search by criteria
    searchFull(){
        if (this.state.postalCode.length  > 0 && this.state.postalCode.length < 7){ // TODO localization
            this.setState({errorMessage: 'That is not valid postal code'});
            return;
        }
        this.setState({errorMessage: null});
        let searchParams = this.assembleSearchString();
        
        if (searchParams.length === 0){
            if (this.state.postalCode){
                // Postal code only- just like Quick Search
                this.searchQuick();
            }
            else {
                // Neither postal code not parameters entered
                return;
            }
        }
        else {
            searchParams = encodeURI(searchParams);
            this.performSearch(searchParams);
        }
    }

    assembleSearchString(){
        const fieldsToCheck = ['lastName', 'firstName', 'city', 'province', 'specialtyId']
        let searchString = fieldsToCheck.reduce((string, fieldName) => {
            return string.concat(this.state[fieldName] ? fieldName + '=' + this.state[fieldName] +  '|' : '');
        }, '');
        const MEorFM = this.state.MEorFM
        const value = MEorFM ? MEorFM === this.CHOICE_EITHER ? null : MEorFM === this.CHOICE_ME ? 'ME' : 'FM' : null
        if (value){
            searchString += 'meorfm=' + value
        }
        if (searchString.endsWith('|')){
            searchString = searchString.substr(0, searchString.length - 1)
        }
        return searchString
    }

    /**  
     * Search by postal code only. This must be across all practitioners.
     */
    searchQuick(){
        if (this.props.allPractitioners.length === 0){
            this.setState({
                errorMessage: 'There are no practitioners in the system'
            });
            return;
        }
        if (this.state.postalCode.length < 7){ // TODO localization
            this.setState({errorMessage: 'You must enter a valid postal code'});
            return;
        }
        const thoseWithPostalCode = this.havingPostalCode(this.props.allPractitioners);
        if (thoseWithPostalCode.length === 0){
            this.setState({
                errorMessage: 'There are no practitioners in the system'
            });
            return;
        }

        this.setState({
            loading: true,
            errorMessage: null
        });

        this.getDistances(this.state.postalCode, thoseWithPostalCode)
        .then( augmentedPractitioners => {
            this.proceedToListView(true, augmentedPractitioners);
        })
        .catch( error => {
            this.setState({
                loading: false,
                errorMessage: error
            });
        })
    }

    havingPostalCode(practitioners){
        return practitioners.filter( practitioner => {
            return !!practitioner.postalCode
        })
    }

    performSearch(searchParams){
        this.setState({
            loading: true,
            errorMessage: null
        });
        axios.get('/practitioners/search?criteria=' + searchParams)
        .then(response => {
            if (response.data.length === 0){
                this.setState({
                    loading: false,
                    errorMessage: 'No practioners were found matching those criteria'
                });
                return;
            }
            // TODO: The response contains the full practitioner entity, rather than just a
            // list of Ids, so must transform specialtyId to the specialty text. Consider
            // modifying  the protocol to return ids only
            const matchingPractitioners = response.data.map( practitioner => {
                return {
                    ...practitioner,
                    specialty: this.props.specialties.idToValue[practitioner.specialtyId]
                }            
            })
            
            if (this.state.postalCode){
                // Since postal code also entered, we want to now do a distance search
                const thoseWithPostalCode = this.havingPostalCode(matchingPractitioners);
                if (thoseWithPostalCode.length === 0){
                    this.setState({
                        errorMessage: 'None of the practitioners matching those criteria have postal codes'
                    })
                    return;
                }

                this.getDistances(this.state.postalCode, thoseWithPostalCode)
                .then(augmentedPractitioners => {
                    this.setState({loading: false});
                    if (augmentedPractitioners){
                        this.proceedToListView(true, augmentedPractitioners);
                    }
                })
                .catch(error => {
                    this.setState({
                        loading: false,
                        errorMessge: error
                    });
                })
            }
            else {
                this.proceedToListView(false, matchingPractitioners);
            }
        })
        .catch (error => {
            this.setState({
                loading: false,
                errorMessage: error
            });
        });
    }

    /**
     * For a given array of practtitioners, determine the distance from a specified origin
     * @param origin the origin postal code
     * @param practitioners an array of practitioners
     * @return the practitioners arrey, each member augmented with the distance
     *         null if the origin postal code was bad
     */ 
    getDistances(origin, practitioners){
        // Create string of practitioner ids separated by '|',
        const practitionerIds = practitioners.reduce((concatenated, practitioner, index, ids) => {
            concatenated = concatenated.concat(practitioner.id).concat(index < ids.length - 1 ? '|' : '');
            return concatenated;
        }, '');

        return new Promise(function (resolve, reject) {
            axios.get('/maps?from=' + origin + '&to=' + practitionerIds)
            .then(response => {
                const distances = response.data;
                const badOriginPostalCode = distances.reduce((allBad, distance) => {
                    return allBad && distance.humanReadable === 'Not found';
                }, true);
    
                if (badOriginPostalCode){
                    // Stay here and display message
                    reject('We were unable to calculate distances from that postal code.\n' +
                        'Please check that the value you entered is correct.\n' + 
                        'If there is still a problem, please use the Full Search without Postal Code.\n' +
                        'We will have a fix for this problem soon.');
                }
                else {
                    const augmentedPractitioners = [];
                    practitioners.forEach((practitioner, i) => {
                        const augmented = {
                            ...practitioner,
                            distance: distances[i]
                        }
                        augmentedPractitioners.push(augmented); 
                    })        
                    resolve(augmentedPractitioners)        
                }
            })
            .catch (error => {
                reject('Error performing distance search');
            });
        })
    }

    proceedToListView(withDistance, matchingPractitioners){
        let queryString = '?'
        queryString += withDistance ? 'withDistance=true': '';
        queryString += matchingPractitioners ? '&withMatchingPractitioners=true' : '';
        if (matchingPractitioners){
            this.props.saveMatchingPractitioners(matchingPractitioners)
        }
        // TODO: Necessary?
        (new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve()
            }, 100)
        })).then(() => {
            this.props.history.push('/search-results' + queryString); 
        });
    }

    render() {
        // Display spinner during the search 
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
            marginBottom: '2em'
        };

        return (
            <>
            <Panel style={panelStyle}>
            <Panel.Body>
            <div className='horizontal-group'>
            <div className='vertical-group'>
                <h4>Search for Practitioners</h4>
                <Instructions width='40em'>
                    To quickly search for any practitioners near you, just enter your postal code and click the Quick Search button
                </Instructions>
                <EditableText valueClass='info-field' labelClass='info-label' 
                        label='Postal Code' value={this.state.postalCode} 
                        name='postalCode' changeHandler={this.onChange}/>
                <Button className='button-large' onClick={this.searchQuick}>Quick Search</Button>

                <Instructions width='40em'>
                    <p>
                    You can also search by entering information in any of the fields below, then click the Full Search button.
                    </p>                   
                    <p>
                    If you also enter a postal code above, any practitioners matching the criteria
                    will be listed along with the distance from that postal code area.
                    </p>
                </Instructions>
                <EditableText name='lastName' 
                    valueClass='info-field' labelClass='info-label' 
                    label='Last Name' value={this.state.lastName} 
                    changeHandler={this.onChange}
                    />
                <EditableText 
                    valueClass='info-field' labelClass='info-label' 
                    label='First Name' value={this.state.firstName} 
                    name='firstName' changeHandler={this.onChange}
                    />
                <Selector 
                    label='Specialty' valueClass='info-field' labelClass='info-label' name='specialty' 
                    options={this.props.specialties.options}
                    value={this.state.specialty ?
                        {label: this.state.specialty, value: this.state.specialtyId}
                        : null} 
                    placeholder='Select ...'
                    onChange =  {(event) => this.onSelectSpecialty(event)}
                    />
                <Selector 
                    label='Province' valueClass='info-field' labelClass='info-label' name='province'  
                    options={this.state.availableProvinces}
                    value={this.state.province ?
                        {label: this.state.province, value: this.state.province}
                        : null} 
                    placeholder='Select ...'
                    onChange =  {(event) => this.onSelectProvince(event)}
                    />
                <Selector 
                    label='City' valueClass='info-field' labelClass='info-label' name='city' 
                    options={this.state.cityOptions}
                    value={this.state.city ?
                        {label: this.state.city, value: this.state.city}
                        : null} 
                    placeholder='Select after province...'
                    onChange =  {(event) => this.onSelectCity(event)}
                    />
                <Selector  
                    label='Knows About' valueClass='info-field' labelClass='info-label' name='disease' 
                    options={this.MEFM_CHOICES}
                    value={this.state.MEorFM ? {label: this.state.MEorFM, value: this.state.MEorFM} : null} 
                    placeholder='Either ME or FM'
                    onChange =  {(event) => this.onSelectMEorFM(event)}
                    />
                <Button className='button-large' onClick={this.searchFull}>Full Search</Button>
                {
                this.state.errorMessage ?
                    <div className='error-message'>{this.state.errorMessage}</div>
                    : ''
                }

            </div>
            </div>            
            </Panel.Body>
            </Panel>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        specialties: state.practitionersReducer.specialties,
        allPractitioners: state.practitionersReducer.allPractitioners,
        moderators: state.userReducer.moderators,
        citiesMap: state.locationReducer.citiesMap
    }
}
const mapDispatchToProps = dispatch => {
    return {
        saveMatchingPractitioners: (matchingPractitioners) => dispatch({ type: actions.SAVE_SEARCH_RESULTS, matchingPractitioners }),
        storeCities: cities => dispatch({ type: STORE_CITIES, cities})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);