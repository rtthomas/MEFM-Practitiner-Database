/**
 * Implements the Registration View
 */
import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import EditableText from './../components/EditableText';
import { isValidEmail } from '../common/utilities';
import * as actions from '../store/userActions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

class Registration extends Component {
    state = {
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        role: 'ACTIVE'
    };

    /** Common change handler for all fields in the form */
    onChange = (event) => {
        this.setState({errorMessage: null});
        const {name, value} = event.target;
        this.setState({
            [name]: value
        });
    }

    /** Validates the firld values and sends the registration request to the server */
    register = () => {
        const message = this.validate();
        this.setState({errorMessage: message});
        if (message){
            return;
        } 
        axios.post('/users/', this.state)
        .then( response => {
            if (response.data.nameAlreadyTaken){
                this.setState({errorMessage: "That username is already taken. Please enter a new value"});
            }
            if (response.data.emailAlreadyTaken){
                this.setState({errorMessage: "That email address is already in use by another user. Please enter a new value"});
            }
            else {
                this.setState({errorMessage: null});
                const newUser = {...this.state};
                this.setState({
                    email: '',
                    username: '',
                    password: ''
                })
                newUser.id = response.data;
                newUser.role = 'ACTIVE';
                this.props.storeLoggedInUser(newUser);
                // TODO replace() ?
                this.props.history.push('/my-activity');
            }            
        });        
    }

    validate = () => {
        if (!this.state.email){
            return "Please provide your email address";
        }
        if (!isValidEmail(this.state.email)){
            return "That's not a valid email";
        }
        if (!this.state.username){
            return "Please enter a username";
        }
        if (isValidEmail(this.state.username)){
            return "You must not use your email address as your username. (Your username is displayed with any comments you enter.)"
        }
        if (!this.state.password){
            return "Please provide a password";
        }
        if (!this.state.confirmPassword || this.state.password !== this.state.confirmPassword){
            return "Passwords must match";
        }
        return null;
     }

    render() {
        return <Form horizontal>
            <div className='horizontal-group'>
            <div className='vertical-group'>
                <EditableText   label='Email'
                                type='email' 
                                name='email'
                                labelClass='info-label info-label-reg'
                                valueClass='info-field info-field-reg'
                                value={this.state.email}
                                placeholder='Email'
                                changeHandler={this.onChange} />

                <EditableText   label='Username' 
                                name='username'
                                labelClass='info-label info-label-reg'
                                valueClass='info-field info-field-reg'
                                placeholder='Username'
                                value={this.state.username}
                                changeHandler={this.onChange} />

                <EditableText   label='Password' 
                                name='password'
                                labelClass='info-label info-label-reg'
                                valueClass='info-field info-field-reg'
                                placeholder='Password'
                                value={this.state.password}
                                changeHandler={this.onChange} />

                <EditableText   label='Confirm Password' 
                                name='confirmPassword'
                                labelClass='info-label info-label-reg'
                                valueClass='info-field info-field-reg'
                                placeholder='Password'
                                value={this.state.confirmPassword}
                                changeHandler={this.onChange} />
                <Button type='button' className='button-large' onClick={this.register}>Register</Button>
                {
                    this.state.errorMessage ? <div className='error-message' style={{'maxWidth': '24em'}}>{this.state.errorMessage}</div> : ''
                }
            </div>
            </div>
            </Form>
    }

}

const mapStateToProps = state => {
    return {
    }
}
const mapDispatchToProps = dispatch => {
    return {
        storeLoggedInUser: user => dispatch({ type: actions.STORE_LOGGED_IN_USER, user: user })
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Registration));

