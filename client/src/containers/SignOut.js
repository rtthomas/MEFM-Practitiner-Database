import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/userActions';
import axios from 'axios';

/**
 * Signs the user out and returns to the Sign In / Registration view
 */
class SignOut extends Component {
    componentDidMount(){
        this.props.signout();
        axios.defaults.headers.common['Authorization'] = '';
        this.props.history.push('/sign-in');
    }
    render() {
        return <div/>
    }
}

const mapDispatchToProps = dispatch => {
    return {
        signout: () => dispatch({ type: actions.LOGOUT })
    }
}

export default connect(null, mapDispatchToProps)(SignOut);