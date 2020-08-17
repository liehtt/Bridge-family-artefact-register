/* Purpose: Part of Header component, displayed as icon, when clicked,
            renders a list of IndividualInvitation components
            to be responsed */
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import IndividualInvitation from '../components/IndividualInvitation';

function InviteButtonModal(props) {

  const [ show, setShow ] = useState(false);
  const handleClose = () => setShow(false);

  function showInvitations() {
      if (!props.userProp.invitations || props.userProp.invitations.filter(e => {return (e.status === 'tbd')}).length === 0) {
          return <p>No one has invited you.</p>
      } else {
          return (props.userProp.invitations.filter(e => {return (e.status === 'tbd')}).map(e => {
              return (
                 <div>
                    {<IndividualInvitation key={props.userProp.invitations._id} acceptFamilyProp={props.acceptFamilyProp} invitationProp={e} />}
                 </div>
              )
          }))
      }
  }

  return (
    <div>
      <div>
        <img src="/images/message.svg" alt="user" height="30px" width="30px" onClick={() => setShow(true)}/>
      </div>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Family invitations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {showInvitations()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default InviteButtonModal;
