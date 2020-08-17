/* Purpose: Home page for logged-in user. Renders list of artifacts
            posted, posting form to post an artifact and a mini profile */

import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import MiniProfile from '../components/MiniProfile';
import GroupList from '../components/GroupList';
import Posting from '../components/artifact/Posting';
import PostList from '../components/artifact/PostList';
import '../static/sass/pages/userPanel.scss';


function UserPanel(props) {
    const [ artifacts, setArtifacts ] = useState([]);
    const [ families, setFamilies ] = useState([]);
    const [ successPost, setSuccessPost ] = useState(false);
    const [ familyMembers, setFamilyMembers ] = useState([]);

    const uniqBy = (arr, predicate) => {
      const cb = typeof predicate === 'function' ? predicate : (o) => o[predicate];

      return [...arr.reduce((map, item) => {
        const key = (item === null || item === undefined) ?
          item : cb(item);

        map.has(key) || map.set(key, item);

        return map;
      }, new Map()).values()];
    };

    /* Get the user's families data to be processed */
    useEffect(() => {
        fetch('/user/families')
        .then(res => res.json())
        .then(families => {
            if (families){
                setFamilies(families);
                let membersArr = [];
                families.map(e => {
                    return (membersArr = membersArr.concat(e.members));
                })
                setFamilyMembers(uniqBy(membersArr, '_id'));
            }
        })
    }, [])

    /* Get user's own artifacts if no families is joined, else fetch all the
        families' members artifacts */
    /* Updates the state of 'families'*/
    useEffect(() => {

        if(families.length === 0) {
            fetch('/getArtifacts')
            .then(res => res.json())
            .then(data => {
                setArtifacts(data);
            })
        } else {
            fetch('/getAllArtifacts')
            .then(res => res.json())
            .then(data => {
                setArtifacts(data);
            })
        }
    }, [families])

    /* Calls api to edit the data of
        artifact, pass as props to PostList component */
    /* Updates the state of 'artifacts' */
    function editArtifact(jsonData){
        fetch('/editArtifact', {
            method: 'POST',
            body: JSON.stringify(jsonData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            const newArtifacts = artifacts.map(e => {
                if (e._id !== data._id) {
                    return e;
                } else {
                    return data
                }
            })
            setArtifacts(newArtifacts);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    /* Calls api to post the artifact, pass as props to Posting component */
    /* Updates the state of artifacts */
    function postArtifact(formData) {
        console.log('in post');
        fetch('/postArtifact', {
            body: formData,
            method: 'POST'
        })
        .then(res => res.json())
        .then(data => {
            console.log('data:', data);
            setArtifacts(prev => [...prev, data]);
            setSuccessPost(true)
        });
    }

    /* Calls api to create family, pass as props to MiniProfile component */
    /* Updates the state of 'families' */
    function createFamily(data) {
        var url = '/createFamily';
        fetch(url, {
          method: 'POST',
          body: JSON.stringify(data),
          headers:{
            'Content-Type': 'application/json'
          }
        }).then(res => res.json())
        .then(response => {
            setFamilies(prev => [...prev, response])
        })
        .catch(error => console.error('Error:', error));
    }

    /* Calls api to accept invitation to join a family, pass as
        props to Header component */
    /* Updates the state of 'families' */
    function acceptFamily(data) {
        var url = '/acceptFamily';
        fetch(url, {
          method: 'POST',
          body: JSON.stringify(data),
          headers:{
            'Content-Type': 'application/json'
          }
        }).then(res => res.json())
        .then(response => {
            setFamilies(prev => [...prev, response])
        })
        .catch(error => console.error('Error:', error));
    }

    function commentArtifact(data) {
        var url = '/comment/commentArtifact/' + data.artifactID;
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(response => {
            // var foundIndex = items.findIndex(x => x.id == item.id);
            // items[foundIndex] = item;
            let index = artifacts.findIndex(x => x._id === response._id);
            artifacts[index] = response;
            //console.log(response);
        })
        .catch(error => console.error('Error:', error));
    }

    function deleteArtifact(id) {
        fetch('/artifact/deleteArtifact/' + id)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.msg === 'deleted') {
                let newArtifacts = artifacts;
                for( var i = 0; i < newArtifacts.length; i++){
                   if ( newArtifacts[i]._id === id) {
                     newArtifacts.splice(i, 1);
                   }
                }
                setArtifacts(newArtifacts);
            }
        });
    }

    function updateAccessLevel(jsonData) {
        fetch('/artifact/updateAccessLevel', {
          method: 'POST',
          body: JSON.stringify(jsonData),
          headers:{
            'Content-Type': 'application/json'
          }
        })
        .then(res => res.json())
        .then(data => {
            const newArtifacts = artifacts.map(e => {
                if (e._id !== data._id) {
                    return e;
                } else {
                    return data;
                }
            })
            console.log('data:', data);

            setArtifacts(newArtifacts);
        })
        .catch(error => console.error('Error:', error));

    }

    return (
        <div className="user-panel">
            <Header userProp={props.user} acceptFamilyProp={acceptFamily} />
            <div className="container content-container">
                <div className="row panel-content justify-content-center">
                    <div className="col-md-3 col-12 px-0 order-md-2 order-sm-1">
                        <MiniProfile user={props.user} createFamilyProp={createFamily} />
                        <GroupList familiesProp={families} />
                    </div>

                    <div className="col-md-9 col-12 pt-4">
                        <div className="row justify-content-center">
                            <div className="col-md-9 col-12 row order-md-1 order-sm-2">
                                <Posting user={props.user} showSuccessProp={successPost} func={postArtifact} membersProp={familyMembers}/>
                                <PostList viewProp='all' accessProp={updateAccessLevel} membersProp={familyMembers} artifacts={artifacts} userProp={props.user} editProp={editArtifact} commentProp={commentArtifact} deleteProp={deleteArtifact}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default UserPanel;
