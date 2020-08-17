/* Purpose: Individual Post component, renders an artifact's information. It
            is a child component for PostList */
import React, {useState}  from 'react';

import CommentSection from '../comment/CommentSection';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import UserListItem from '../../components/UserListItem';
import '../../static/sass/vendors/bootstrap.scss'

function Post(props) {

    const [commentCollapse, setCommentCollapse] = useState(true);

    const [chosenMembers, setChosenMembers] = useState([]);
    const [showAccessLevel, setShowAccessLevel] = useState(false);

    const [showDelete, setShowDelete] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState('');


    function handleSubmitEditText() {
        var data = {id: props.artifactID, text: editText}
        props.editProp(data);
        setIsEditing(false);
    }

    function handleCloseDelete() {
        setShowDelete(false);
    }

    function handleDelete() {
        props.deleteProp(props.artifactID);
        setShowDelete(false);
    }

    function handleSaveAccessLevel() {
        if(chosenMembers.length !== 0) {
            let members = chosenMembers.map(e => {return(e._id)});
            members = members.toString();
            let data = {viewBy: members, owner: props.userProp._id, viewPermission: 'selected', id: props.thisPost._id}
            props.accessProp(data);
            setShowAccessLevel(false);
        } else {
            alert('no members are chosen');
        }
    }

    function handleCloseAccessLevel() {
        setShowAccessLevel(false);
        setChosenMembers([]);
    }

    function addMember(selection) {
        if(chosenMembers.length === 0) {
            setChosenMembers([selection]);

        } else {
            if(chosenMembers.length === chosenMembers.filter(e => e._id !== selection._id).length) {
                setChosenMembers(prev => (prev.concat([selection])));
            } else {
                setChosenMembers(chosenMembers.filter(e => e._id !== selection._id));
            }

        }
    }

    // eslint-disable-next-line no-extend-native
    Date.prototype.yyyymmdd = function() {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();

        return [this.getFullYear(), '-',
              (mm>9 ? '' : '0') + mm, '-',
              (dd>9 ? '' : '0') + dd
             ].join('');
    };

    var date = new Date(props.thisPost.timePosted);

    var post = (
        <div className="col-12 px-0 mb-3">
            <div className="card">
                <div className="card-body">
                    <div className='row mb-1'>
                        <div className="col-3 col-lg-2">
                            <img src={props.thisPost.owner.avatar} style={{marginRight: '10px'}} alt='avatar'className="rounded-circle-sm" position='relative' left='50px'/>
                        </div>
                        <div className='col-8 col-lg-9'>
                            <div className='row'>
                                <p style={{ position: 'relative', fontWeight:600}}>{props.thisPost.anonymous === 'false' ? props.thisPost.owner.nickName : 'Anonymous'}</p>
                            </div>
                            <div className='row'>
                                <p style={{ position: 'relative', top: '-15px', color: 'grey'}}>{date.yyyymmdd()}</p>
                            </div>
                        </div>
                        <div className="col-1">
                            {props.thisPost.owner._id === props.userProp._id &&
                                <Dropdown>
                                  <Dropdown.Toggle as='img' src="/images/post-setting.png" width='20' variant="success" id="dropdown-basic">
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setShowAccessLevel(true)}>Set access level</Dropdown.Item>
                                    <Dropdown.Item onClick={() => {setIsEditing(true); setEditText(props.thisPost.description);}}>Edit artifact</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setShowDelete(true)}>Delete artifact</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                            }

                        </div>
                    </div>

                    {isEditing ? (
                        <div>
                            <textarea style={{marginRight: '10px'}} onChange={(e) => setEditText(e.target.value)} value={editText} type="text" name="edit"/>
                            <button className='btn btn-primary' style={{marginRight: '10px', position:'relative', top:'-15px'}} type="button" onClick={handleSubmitEditText}>Save</button>
                            <button className='btn btn-secondary' style={{ position:'relative', top:'-15px'}} onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    ) : <div className="row mb-3 card-text">{props.thisPost.description}</div>}

                    {props.thisPost.image.length !== 0 &&
                        (
                            <div className='row mb-1'>
                                <img className="card-img-top" src={props.thisPost.image[0]} alt="artifact"/>
                            </div>
                        )
                    }

                    {/* <div className="row">
                        <div className="col-6">
                            {props.thisPost.timeHappened !== null &&
                                (
                                    <div className='row mb-1'>
                                        <p className="card-text"><b>Happened Time</b>: {new Date(props.thisPost.timeHappened).yyyymmdd()}</p>
                                    </div>
                                )
                            }
                        </div>
                        <div className="col-6">
                            {props.thisPost.location.length !== 0 &&
                                (
                                    <div className='row mb-1'>
                                        <p className="card-text"><b>Happened Location</b>:{props.thisPost.location}</p>
                                    </div>
                                )
                            }
                        </div>
                    </div> */}

                    {props.thisPost.timeHappened !== null &&
                        (
                            <div className='row mb-1'>
                                <p className="card-text"><b>Happened Time</b>: {new Date(props.thisPost.timeHappened).yyyymmdd()}</p>
                            </div>
                        )
                    }

                    {props.thisPost.location.length !== 0 &&
                        (
                            <div className='row mb-1'>
                                <p className="card-text"><b>Happened Location</b>: {props.thisPost.location}</p>
                            </div>
                        )
                    }       
                   
                   

                   

                    <div className="row">
                        <div className="postIcon">
                            <img src="/images/comment.png" width='30px' style={{marginRight: '10px'}} alt="comment" onClick={() => setCommentCollapse(!commentCollapse)}/>
                        </div>
                        {props.comments.length !== 0 ?
                            (
                                <div>
                                    <p>{props.comments.length} {props.comments.length === 1 ? 'comment' : 'comments'}</p>
                                </div>
                            ) :
                            (
                                <div>
                                    <p>Add comment</p>
                                </div>
                            )
                        }
                    </div>
                    {commentCollapse === false &&
                        (
                            <div>
                                <hr></hr>
                                <CommentSection artifactID={props.artifactID} comments={props.comments} commentProp={props.commentProp}/>
                            </div>
                        )
                    }

                </div>
                {
                    <div>
                        <Modal show={ showDelete } onHide={ handleCloseDelete }>
                            <Modal.Body>
                                <h3>Delete this artifact?</h3>
                                <p>Deleting the artifact will permanently remove the artifact from your account.</p>
                                <button type="button" onClick={handleDelete}>Yes, delete.</button>
                                <button type="button" onClick={handleCloseDelete}>Cancel</button>
                            </Modal.Body>
                        </Modal>
                    </div>
                }

                {
                    <div>
                      <Modal show={showAccessLevel} onHide={handleCloseAccessLevel} animation={false}>
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
                          <Button variant="secondary" onClick={handleCloseAccessLevel}>
                            No changes are made
                          </Button>
                          <Button variant="primary" onClick={handleSaveAccessLevel}>
                            Yes, only these members are allowed see my post
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                }

            </div>
        </div>
    );

    return post;
}

export default Post;
