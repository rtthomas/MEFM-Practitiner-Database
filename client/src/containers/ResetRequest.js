/**
 * Implements the Reset Request view, where the user can request a reset of his or her password.
 * ResetRequest passes through a series of steps:
 * <ul>
 * <li>'request': the user is prompted to submit their email address, and to enter the code subsequently sent to that address</li> 
 * <li>'password': the user is prompted for the new password, with confirmation</li> 
 * <li>'finished': the user is informed of the successful password change</li> 
 * </ul>
 */
import React, { Component } from 'react';
import { Panel, Button } from 'react-bootstrap';
import Instructions from '../components/Instructions';
import EditableText from './../components/EditableText';
import { isValidEmail } from '../common/utilities';
import axios from 'axios';

class ResetRequest extends Component {

    state = {};

    constructor(props){
        super(props)
        this.state = {
            email: '',
            errorMessage: null,
            step: 'request',
            code: null,
            password: null,
            confirmPassword: null
        }
        this.onChange = this.onChange.bind(this);
        this.validateAndSubmitAddress = this.validateAndSubmitAddress.bind(this);
        this.sendCode = this.sendCode.bind(this);
        this.validateAndSubmitReset = this.validateAndSubmitReset.bind(this);
        this.returnToLogin = this.returnToLogin.bind(this);
    }

    /** Common change handler for all fields in all steps */
    onChange(event) {
        this.setState({errorMessage: null});
        const {name, value} = event.target;
        this.setState({
            [name]: value
        });
    }

    /** Checks for a valid email format, then sends request to server to email a rest code to the user */
    validateAndSubmitAddress() {
        if (!this.state.email){
            this.setState({errorMessage: 'Please provide your email address'}) ;
        }
        else if (!isValidEmail(this.state.email)){
            this.setState({errorMessage: 'That\'s not a valid email'});
        }
        else {
            axios.post('/reset/request', this.state.email)
            .then((response) => {
                if (response.data.status !== 'FOUND'){
                    this.setState({errorMessage: 'No user has been found for that address. Please re-enter your email'});
                }
             });
        }
    }

    /** Submits the code the user enters after receiving the email message */
    sendCode() {
        axios.post('/reset/confirm', this.state.code)
        .then((response) => {
            if (response.data.status === 'FOUND'){
                this.setState({step: 'password'});
            }
            else {
                this.setState({errorMessage: 'That code is not valid. Please re-enter the code and try again'});
            }
         });
    }

    /** Confirms that the new password and confirmation match, then sends the value to the server */
    validateAndSubmitReset = () => {
        const message = this.validate();
        this.setState({errorMessage: message});
        if (message){
            return;
        } 
        const reset = {code: this.state.code, password: this.state.password};
        axios.post('/reset/finish', reset)
        .then( response => {
            this.setState({step: 'finished'});        
        });        
    }

    validate = () => {
        if (!this.state.password){
            return "Please provide a password";
        }
        if (!this.state.confirmPassword || this.state.password !== this.state.confirmPassword){
            return "Passwords must match";
        }
        return null;
    }

    returnToLogin(){
        this.props.history.push('/sign-in?clear=true');
    }

    render() {
        const panelStyle = {
            width:'90%',
            margin: 'auto',
            marginBottom: '2em',
            padding: '1em'
        };

        return (
            <Panel style={panelStyle}>
                {this.state.step === 'request' ?
                    <Panel.Body>
                        <Instructions width='40em'>
                        Please enter your email address and click Submit. 
                        You will receive a message containing your username and a code for resetting your password.
                        </Instructions>
                        <div className='horizontal-group'>
                            <div className='vertical-group'>
                                <EditableText 
                                        type='email'  
                                        label='Your Email'
                                        name='email'
                                        labelClass='info-label'
                                        valueClass='info-field'
                                        value={this.state.email}
                                        changeHandler={this.onChange} />
                                <Button className='button-large' onClick={this.validateAndSubmitAddress}>Submit</Button>
                            </div>
                        </div>
                        <Instructions width='40em' paddingTop='2em'>
                        When you receive the email, enter the code below and click Send Code. 
                        </Instructions>
                        <div className='horizontal-group'>
                            <div className='vertical-group'>
                                <EditableText   
                                    label='Code' 
                                    name='code'
                                    labelClass='info-label'
                                    valueClass='info-field'
                                    value={this.state.code}
                                    changeHandler={this.onChange} />
                               <Button className='button-large' onClick={this.sendCode}>Send Code</Button>
                             </div>
                            {
                                this.state.errorMessage ? <div className='error-message'>{this.state.errorMessage}</div> : ''
                            }
                        </div>
                    </Panel.Body>
                    : ''
                }
                {this.state.step === 'password' ?
                    <Panel.Body>
                        <Instructions width='40em'>
                        Please enter and confirm your new password. 
                        </Instructions>
                        <div className='horizontal-group'>
                            <div className='vertical-group'>
                            <EditableText   
                                label='Password' 
                                name='password'
                                labelClass='info-label info-label-reg'
                                valueClass='info-field info-field-reg'
                                value={this.state.password}
                                changeHandler={this.onChange} />

                            <EditableText label='Confirm Password' 
                                name='confirmPassword'
                                labelClass='info-label info-label-reg'
                                valueClass='info-field info-field-reg'
                                value={this.state.confirmPassword}
                                changeHandler={this.onChange} />
                                <Button className='button-large' onClick={this.validateAndSubmitReset}>Reset Password</Button>
                                {
                                this.state.errorMessage ? <div className='error-message'>{this.state.errorMessage}</div> : ''
                                }

                            </div>
                        </div>
                    </Panel.Body>
                    : ''
                }
                {this.state.step === 'finished' ?
                    <Panel.Body>
                        <Instructions width='40em'>
                        Your password has been reset 
                        </Instructions>
                        <Instructions width='40em'>
                        <span className='execute' onClick={this.returnToLogin}>Return to the login page</span> 
                        </Instructions>
                    </Panel.Body>
                    : ''
                }
             </Panel>
        )
    }
}

export default ResetRequest;