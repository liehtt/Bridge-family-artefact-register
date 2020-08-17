import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import UserListItem from '../components/UserListItem';

function UserListModal(props) {
  const [show, setShow] = useState(false);
  const [chosenMembers, setChosenMembers] = useState([]);

  function handleClose() {
      setShow(false);
      setChosenMembers([]);
      props.sendData([]);
  }

  function handleSave() {
      if(chosenMembers.length !== 0) {
          if(props.typeProp !== 'post') {
              setShow(false);
          } else {
              let members = chosenMembers.map(e => {return(e._id)});
              members = members.toString();
              let data = {viewBy: members, owner: props.userProp._id, viewPermission: 'selected', id: props.artifactProp._id}
              props.accessProp(data);
              setShow(false);
          }
      } else {
          alert('no members are chosen');
      }

  }
  const handleShow = () => setShow(true);

  function addMember(selection) {
      if(chosenMembers.length === 0) {
          setChosenMembers([selection]);
          props.sendData([selection]);

      } else {
          if(chosenMembers.length === chosenMembers.filter(e => e._id !== selection._id).length) {
              props.sendData(chosenMembers.concat([selection]));
              setChosenMembers(prev => (prev.concat([selection])));
          } else {
              props.sendData(chosenMembers.filter(e => e._id !== selection._id));
              setChosenMembers(chosenMembers.filter(e => e._id !== selection._id));
          }

      }
  }

  return (
    <>
      <button type="button" onClick={handleShow} className="button button-green">
        Set Access
      </button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Family members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <ListGroup>
        {props.membersProp.map(e => {
            if(props.userProp._id !== e._id) {
                return(<UserListItem memberProp={e} addProp={addMember} key={e._id} />)
            }
            return null;
        })}
        </ListGroup>
        {chosenMembers.length !== 0 &&
            chosenMembers.map(e => {
                return(<p key={e._id}>{e.nickName}</p>)
            })
        }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No changes are made
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Yes, only these members are allowed see my post
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UserListModal;
