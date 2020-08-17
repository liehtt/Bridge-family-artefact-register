/**
 * This component renders the content of a comment
 */
import React from 'react';

function Comment(props) {

    return (
        <div>
            <div className='row col-12 align-self-center'>
                <img src={props.comment.userID.avatar} style={{paddingRight: '5px'}} alt='avatar' width='25px' height='20px' position='relative'/>
                <p style={{fontWeight:600, marginBottom: 0}}>{props.comment.userID.nickName}</p>
            </div>
            <div className='row col-12 align-self-center'>
                <p>{props.comment.content}</p>
            </div>
        </div>
    )
}

export default Comment;
