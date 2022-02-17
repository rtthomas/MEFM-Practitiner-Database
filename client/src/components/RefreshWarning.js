/**
 * A modal popup to explain to Chrome users not to refresh
 */
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import warningImage from '../images/chrome-warning.png';

const refreshWarning = props => {
    const style = {
        border: '2px solid gray', 
        height: '100%',
        width: '100%',
        objectFit: 'contain',
        marginBottom: '0.6em'
    }
    return (
        <Modal show='true' size="lg" aria-labelledby="contained-modal-title-vcenter" centered='true' onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    About the Chrome Refresh Button
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Don't use it!</h4>
                <p>
                Refreshing the browser in this application can cause errors.
                When you see a popup like this...
                </p>
                <div><img src={warningImage} style={style} alt=''></img></div>
                <p>... just click the Cancel button. </p>
                <p>This is the only time you'll be bothered with this warning.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button size='sm' onClick={props.onClose}>Close</Button>
            </Modal.Footer>
        </Modal>        
    )
}
export default refreshWarning;