import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

function UserListItem(props) {

    function addMember() {
        props.addProp(props.memberProp);
    }

    return(
        <div>
            <ListGroup.Item>

                <strong style={{marginRight: '10px'}}>{props.memberProp.nickName}</strong>
                <button type='button' className="button button-green" style={{borderRadius: '6px'}} onClick={addMember}>Allow this member to view</button>
            </ListGroup.Item>
        </div>
    )
}

export default UserListItem;
