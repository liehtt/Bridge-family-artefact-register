/**
 * This component is used to render the comment section attached to each family
 * artifact.
 */

import React from 'react';

import CommentPost from './CommentPost';
import CommentList from './CommentList';

function CommentSection(props) {

    return (
        <div className="commentSection">
            <CommentList comments={props.comments}/>
            <div className='row'>
            <CommentPost artifactID={props.artifactID} commentProp={props.commentProp}/>
            </div>
        </div>
    )

}

export default CommentSection;
