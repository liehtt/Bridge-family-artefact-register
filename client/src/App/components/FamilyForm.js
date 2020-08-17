/* Purpose: Renders a modal form for user to create a family group */

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function FamilyForm(props) {

    /* isModal controls state of modal, if true, modal
        with family form as content is rendered. */
    const [ isModal, setIsModal ] = useState(false);

    /* Keeps track of the content for group name and description field */
    const [ groupName, setGroupName ] = useState('');
    const [ description, setDescription] = useState('');
    const [ showEmptyError, setShowEmptyError] = useState(false);

    /* Invokes prop function (api) with groupname and description as params.
        Hide the modal afterthat */
    function handleSubmit() {
        if(groupName.length === 0 || description.length === 0) {
            setShowEmptyError(true);
        } else {
            props.createFamilyProp({groupName: groupName, description: description});
            setShowEmptyError(false);
            setIsModal(!isModal);
        }
    }

    return (
        <div className="family-form-container text-border">
            <div className="text-border">
                <Button color="deep-purple" className="text-border" onClick={() => setIsModal(!isModal)}>Create family group</Button>
                <Modal className="modal-create-family text-border" show={isModal} onHide={() => setIsModal(!isModal)}>
                    <Modal.Header className="text-border" onHide={() => setIsModal(!isModal)}>
                        <Modal.Title>Create family group</Modal.Title>
                    </Modal.Header>
                    <Form style={{position: 'relative', top: '-30px'}}>
                        <Modal.Body className="text-border">
                            <Form>
                                <Form.Group>
                                    <div className="post-content">
                                        <Form.Label><strong>Group Name</strong></Form.Label>
                                        <Form.Control type="text" placeholder="Enter family group name" onChange={(e) => setGroupName(e.target.value)}/>
                                        <Form.Label><strong>Description of family group</strong></Form.Label>
                                        <Form.Control type="textarea" placeholder="Enter description of family group" onChange={(e) => setDescription(e.target.value)}/>
                                    </div>
                                </Form.Group>
                            </Form>
                            {showEmptyError &&
                                (
                                    <div style={{position: 'relative', top: '-30px', left: '20px'}}>
                                        <p style={{color: '#cc0000'}}>Error: Group name or description is missing.</p>
                                    </div>
                                )
                            }
                            <Button variant="primary" onClick={handleSubmit}>
                                Create
                            </Button>
                        </Modal.Body>
                    </Form>
                </Modal>
            </div>
        </div>
    )
}
export default FamilyForm;
