/**
 * A modal dialog for entering a new comment
 */
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import ExpandingText from './ExpandingText';

const newComment = (props) => {

    return (
        <Modal show={props.show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered='true' onHide={props.onCancel}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                Enter your comment
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ExpandingText className='new-comment' value={props.value} onChange={props.onChange}/>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onCancel}>Cancel</Button>
                <Button onClick={props.onSave}>Save</Button>
            </Modal.Footer>
      </Modal>
    )
}

export default newComment;

