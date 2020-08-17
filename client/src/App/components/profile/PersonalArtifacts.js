/* Purpose: Part of Profile page component, renders a list of artifacts
            created by user only */

import React, { useState, useEffect } from 'react';
import PostList from '../artifact/PostList';

function PersonalArtifacts(props) {

    const [ artifacts, setArtifacts ] = useState([]);
    // const [ families, setFamilies ] = useState([]);
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

    /* Fetch user's artifacts to be passed as props to PostList component */
    useEffect(() => {
        fetch('/getArtifacts')
            .then(res => res.json())
            .then(data => {
                setArtifacts(data);
            })
    },[]);

    useEffect(() => {
        fetch('/user/families')
        .then(res => res.json())
        .then(families => {
            if (families){
                // setFamilies(families);
                let membersArr = [];
                families.map(e => {
                    return (membersArr = membersArr.concat(e.members));
                })
                setFamilyMembers(uniqBy(membersArr, '_id'));
            }
        })
    }, [])
    /* Calls api to edit the data of
        artifact, pass as props to PostList component */
    /* Updates the state of 'artifacts' */
    function editArtifact(jsonData) {
        fetch('/editArtifact', {
            method: 'POST',
            body: JSON.stringify(jsonData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
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
            let index = artifacts.findIndex(x => x._id === response._id);
            artifacts[index] = response;
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
                console.log('deleted');
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
            <PostList artifacts={artifacts} accessProp={updateAccessLevel} membersProp={familyMembers} viewProp='selected' editProp={editArtifact} userProp={props.user} commentProp={commentArtifact} deleteProp={deleteArtifact}/>
    )
}

export default PersonalArtifacts;
