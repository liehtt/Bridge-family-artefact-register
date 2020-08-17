/**
 * This component is used to render a list of comments for the associated
 * family artifact.
 */
import React from 'react';

import Comment from './Comment';

function CommentList(props) {
    return (
        props.comments.map(comment => {
            return (
                    <Comment key={comment._id} comment={comment}/>
            )
        })
    );
}

export default CommentList;
