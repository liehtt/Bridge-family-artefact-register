/* Purpose: Renders invitation request received, user can choose to Accept or
            Reject the invitation by clicking the button */
import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function IndividualInvitation(props) {

    function handleAcceptClick() {
        var data = { id: props.invitationProp._id, family: props.invitationProp.family, newStatus: 'done' }
        props.acceptFamilyProp(data);
        //alert('You accepted the invitation. Please refresh the page to render the changes.');
    }

    function handleRejectClick() {
        var data = { id: props.invitationProp._id, newStatus: 'rejected' }
        var url = '/rejectFamily';
        fetch(url, {
          method: 'POST',
          body: JSON.stringify(data),
          headers:{
            'Content-Type': 'application/json'
          }
        }).then(res => res.json())
        .then(response => {
            //alert('You rejected the invitation. Please refresh the page to render the changes.');
        })
        .catch(error => console.error('Error:', error));
    }

    return(
        <Card style={{ width: '30rem' }}>
          <Card.Body>
            <Card.Title>{props.invitationProp.groupName}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{props.invitationProp.description}</Card.Subtitle>
            <Card.Text>
              <p>You are invited by <strong>{props.invitationProp.receivedFrom.nickName}</strong> to join this family: {props.invitationProp.groupName}</p>
            </Card.Text>
            <Row>
                <Col>
                    <Button variant="success" onClick={handleAcceptClick}>Yes, accept the invitation.</Button>
                </Col>
                <Col>
                    <Button variant="danger" onClick={handleRejectClick}>No, reject the invitation.</Button>
                </Col>
            </Row>
          </Card.Body>
        </Card>
    )
}

export default IndividualInvitation;
