/* Purpose: Renders a modal form when button is clicked. Modal form
            has field for filling a user's email to invite
            the user as family member. */
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function InviteButtonModal(props) {

  /* Keeps track of the content of the field */
  const [ inviteeEmail, setInviteeEmail ] = useState('');
  const [ showEmptyError, setShowEmptyError ] = useState(false);
  const [ showNoUserError, setShowNoUserError] = useState(false);
  const [ showInFamilyError, setShowInFamilyError] = useState(false);
  const [ showSuccess, setShowSuccess] = useState(false);

  const [ show, setShow ] = useState(false);


  function handleClose() {
      setShow(false);
      setShowEmptyError(false);
      setShowNoUserError(false);
      setShowSuccess(false);
      setShowInFamilyError(false);
      setInviteeEmail('');
  }


  /* Calls api to send a request to another user */
  function handleInviteClick() {
      if(inviteeEmail === '') {
          setShowEmptyError(true);
          setShowNoUserError(false);
          setShowSuccess(false);
          setShowInFamilyError(false);
      } else {
          var data = { email: inviteeEmail,
                       family: props.familyProp._id,
                       description: props.familyProp.description,
                       groupName: props.familyProp.groupName,
                       groupAvatar: props.familyProp.groupAvatar
                     }

          var url = '/inviteFamily';
          fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
              'Content-Type': 'application/json'
            }
          }).then(res => res.json())
          .then(response => {
              if(response.status === 'not-found') {
                  setShowEmptyError(false);
                  setShowNoUserError(true);
                  setShowSuccess(false);
                  setShowInFamilyError(false);
              } else if (response.status === 'already-in-family') {
                  setShowEmptyError(false);
                  setShowNoUserError(false);
                  setShowSuccess(false);
                  setShowInFamilyError(true);
              } else {
                  setShowEmptyError(false);
                  setShowNoUserError(false);
                  setShowSuccess(true);
                  setShowInFamilyError(false);

              }
          })
          .catch(error => console.error('Error:', error));
      }
  }

  return (
    <div>
      <Button variant="primary" onClick={() => setShow(true)}>
        Invite family member
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Invite family member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter the email of the user you want to invite" onChange={(e) => setInviteeEmail(e.target.value)} />
                {showEmptyError && (
                    <div>
                        <p style={{color: '#cc0000'}}>Error: Missing information.</p>
                    </div>
                )}
                {showNoUserError && (
                    <div>
                        <p style={{color: '#cc0000'}}>Error: There's no user with this email address</p>
                    </div>
                )}
                {showSuccess && (
                    <div>
                        <p style={{color: '#4BCA81'}}>Success: User is invited.</p>
                    </div>
                )}
                {showInFamilyError && (
                    <div>
                        <p style={{color: '#cc0000'}}>Error: User is already in the family</p>
                    </div>
                )}
              </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Nah, no one's invited.
          </Button>
          <Button variant="primary" onClick={handleInviteClick}>
            Yes, invite this person!
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default InviteButtonModal;
