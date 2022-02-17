/**
* Implements the footer along the bottom of the application
* This version provides only the Contact Us link
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import Instructions from '../components/Instructions';
import ExpandingText from '../components/ExpandingText';


class Footer extends Component {

    state = {}

    constructor(props){
        super(props);
        this.showPopup = this.showPopup.bind(this);
        this.hidePopup = this.hidePopup.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
        this.onChange = this.onChange.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
    }

    hidePopup(){
        this.setState({show: false})
    }

    showPopup() {
        this.setState({
            show: true,
            sent: false
        })
    }

    sendRequest() {
        axios.post('/support?user=' + this.props.loggedInUser.id, this.state.message)
        .then(response => {
            this.setState({
                sent: true
            })
        })
    }

    onChange(event) {
        this.setState({ 
            message: event.target.value
        }) 
    } 

    render() {
        return (
            <>
            <div className='footer'>
                <span onClick={this.showPopup}>Contact Us</span>
            </div>
            <Modal show={this.state.show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered='true' onHide={this.hidePopup}>
                <Modal.Body>
                    {this.state.sent ? 
                        <Instructions>
                            Your message has been sent. Thank you for your feedback
                        </Instructions>
                        :
                        <>
                        <Instructions>
                            Enter your comments or requests and click the Send button. We will respond to you soon.
                        </Instructions>
                        <div className='contact-us'>
                            <ExpandingText className='new-comment' value={this.state.message} onChange={this.onChange}/>
                        </div>
                        </>
                    }
                </Modal.Body>
                <Modal.Footer>
                    {this.state.sent ?
                        <Button onClick={this.hidePopup}>Close</Button>
                        :
                        <>
                        <Button onClick={this.hidePopup}>Cancel</Button>
                        <Button onClick={this.sendRequest}>Send</Button>
                        </>
                    }
                </Modal.Footer>
            </Modal>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        loggedInUser: state.userReducer.loggedInUser
     }
}

export default connect(mapStateToProps)(Footer);
