/**
 * This component renders a form used to post a comment towards an artifact.
 */
import React, {useState} from 'react';

function CommentPost(props) {

    const [comment, setComment ] = useState('');
    const [showEmptyError, setShowEmptyError] = useState(false);

    function onClick() {
        if(comment.length === 0) {
            setShowEmptyError(true);
        } else {
            let data = {
                artifactID: props.artifactID,
                comment: comment
            }
            document.getElementById(props.artifactID).value = '';
            setComment('');
            setShowEmptyError(false);
            props.commentProp(data);
        }
    }

    return (
        <div>
        <form>
            <input type="textarea" row="10" column="30" style={{marginRight: '10px', textIndent: '7px'}}id={props.artifactID} name="comment" placeholder="Say something..." onChange={(e) => {setComment(e.target.value);}}></input>
            <button className="btn btn-primary btn-sm" style={{position:'relative', top: '-2px'}}type="button" onClick={onClick}>Post Comment</button>
        </form>
        {showEmptyError &&
            (
                <div clasName="row">
                    <p style={{color: '#cc0000'}}>Error: The comment box is empty!</p>
                </div>
            )
        }
        </div>
    );
}

export default CommentPost;
