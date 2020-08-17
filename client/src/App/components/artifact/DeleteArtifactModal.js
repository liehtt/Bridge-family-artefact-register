import React, { useState } from 'react';

import Modal from 'react-bootstrap/Modal';

function DeleteArtifactModal(props) {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    function handleDelete() {
        props.deleteProp(props.artifactID);
        setShow(false);
    }

    return (
        <div>
            <img src="/images/delete.png" width='30' alt="delete" onClick={ () => setShow(true) }/>

            <Modal show={ show } onHide={ handleClose }>
                <Modal.Body>
                    <h3>Delete this artifact?</h3>
                    <p>Deleting the artifact will permanently remove the artifact from your account.</p>
                    <button type="button" onClick={handleDelete}>Yes, delete.</button>
                    <button type="button" onClick={handleClose}>Cancel</button>
                </Modal.Body>
            </Modal>
        </div>
    );

}

export default DeleteArtifactModal;
