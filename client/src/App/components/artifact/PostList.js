/**
 * Purpose: Renders a list of Post (artifacts). Prompts user to create a post
 * if user has no artifacts
 */

import React from 'react';
import Post from './Post';

function PostList(props) {
    if(props.viewProp === 'selected') {
        var publicArr = [];
        var privateArr = [];
        if(props.artifacts.length !== 0) {
            props.artifacts.map(e => {
                if(e.viewPermission !== 'all') {
                    if(e.viewBy.includes(props.userProp._id)) {
                        privateArr.push(e);
                    }
                } else {
                    publicArr.push(e)
                }

                return null;
            })

            if(privateArr.length === 0 && publicArr.length !== 0){
                return(
                    <div>
                        <div className='row justify-content-center'>
                            <p style={{fontSize: '30px'}}>Public Artifacts</p>
                        </div>
                        {publicArr.map(e => {
                            return (
                                <Post
                                    key={e._id}
                                    editProp={props.editProp}
                                    thisPost={e}
                                    artifactID={e._id}
                                    comments={e.comments}
                                    commentProp={props.commentProp}
                                    userProp={props.userProp}
                                    deleteProp={props.deleteProp}
                                    membersProp={props.membersProp}
                                    accessProp={props.accessProp}
                                />)
                        })}
                        <div>NO PRIVATE ARTIFACTS. POST SOME!</div>
                    </div>
                )
            }
            if(publicArr.length === 0 && privateArr.length !== 0){
                return(
                    <div>
                        <div>NO PUBLIC ARTIFACTS. POST SOME!</div>
                        <div className='row justify-content-center'>
                            <p style={{fontSize: '30px'}}>Private Artifacts</p>
                        </div>
                        {privateArr.map(e => {
                            return (
                                <Post
                                    key={e._id}
                                    editProp={props.editProp}
                                    thisPost={e}
                                    artifactID={e._id}
                                    comments={e.comments}
                                    commentProp={props.commentProp}
                                    userProp={props.userProp}
                                    deleteProp={props.deleteProp}
                                    membersProp={props.membersProp}
                                    accessProp={props.accessProp}

                                />)
                        })}
                    </div>
                )
            }



            return (
                <div>
                <div className='row justify-content-center'>
                    <p style={{fontSize: '30px'}}>Public Artifacts</p>
                </div>
                    {publicArr.map(e => {
                        return (
                            <Post
                                key={e._id}
                                editProp={props.editProp}
                                thisPost={e}
                                artifactID={e._id}
                                comments={e.comments}
                                commentProp={props.commentProp}
                                userProp={props.userProp}
                                deleteProp={props.deleteProp}
                                membersProp={props.membersProp}
                                accessProp={props.accessProp}
                            />)
                    })}
                    <div className='row justify-content-center'>
                        <p style={{fontSize: '30px'}}>Private Artifacts</p>
                    </div>
                    {privateArr.map(e => {
                        return (
                            <Post
                                key={e._id}
                                editProp={props.editProp}
                                thisPost={e}
                                artifactID={e._id}
                                comments={e.comments}
                                commentProp={props.commentProp}
                                userProp={props.userProp}
                                deleteProp={props.deleteProp}
                                membersProp={props.membersProp}
                                accessProp={props.accessProp}

                            />)
                    })}
                </div>
            )
        }
    } else {
        if(props.artifacts.length !== 0) {
            return (props.artifacts.map(e => {
                if(e.viewPermission !== 'all') {
                    if(e.viewBy.includes(props.userProp._id)) {
                        return (
                            <Post
                                key={e._id}
                                editProp={props.editProp}
                                thisPost={e}
                                artifactID={e._id}
                                comments={e.comments}
                                commentProp={props.commentProp}
                                userProp={props.userProp}
                                deleteProp={props.deleteProp}
                                membersProp={props.membersProp}
                                accessProp={props.accessProp}

                            />
                        )
                    }
                } else {
                    return (
                        <Post
                            key={e._id}
                            editProp={props.editProp}
                            thisPost={e}
                            artifactID={e._id}
                            comments={e.comments}
                            commentProp={props.commentProp}
                            userProp={props.userProp}
                            deleteProp={props.deleteProp}
                            membersProp={props.membersProp}
                            accessProp={props.accessProp}

                        />
                    )
                }

                return null;
            }))
        }
    }


    return(
        <div className="col-12 text-center">
            <strong >No artifacts yet? Upload some artifacts!</strong>
        </div>
    );
}

export default PostList;
