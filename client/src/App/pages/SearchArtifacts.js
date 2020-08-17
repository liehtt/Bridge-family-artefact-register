/* Purpose: Page showing the artifacts matching the searched text */

import Footer from '../components/Footer';
import Header from '../components/Header';
import React, { useState, useEffect } from 'react';
import PostList from '../components/artifact/PostList';
import '../static/sass/vendors/bootstrap.scss';

function SearchArtifacts (props) {
    const [artifacts, setArtifacts] = useState([]);
    const [families, setFamilies] = useState([]);
    const [familyMembers, setFamilyMembers] = useState([]);
    const uniqBy = (arr, predicate) => {
        const cb = typeof predicate === 'function' ? predicate : (o) => o[predicate];

        return [...arr.reduce((map, item) => {
            const key = (item === null || item === undefined) ?
                item : cb(item);

            map.has(key) || map.set(key, item);

            return map;
        }, new Map()).values()];
    };
    useEffect(() => {
        // get user families
        fetch('/user/families')
            .then(res => res.json())
            .then(families => {
                if (families) {
                    setFamilies(families);
                    let membersArr = [];
                    families.map(e => {
                        return (membersArr = membersArr.concat(e.members));
                    })
                    setFamilyMembers(uniqBy(membersArr, '_id'));
                }
            })
    }, [])

    useEffect(() => {

        if (families.length === []) {
            fetch('/getArtifacts')
                .then(res => res.json())
                .then(data => {
                    setArtifacts(data.artifacts);
                })
        } else {
            fetch('/getAllArtifacts')
                .then(res => res.json())
                .then(data => {
                    setArtifacts(data);
                })
        }
    }, [families])

    function commentArtifact(data) {
        var url = '/comment/commentArtifact/' + data.artifactID;
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
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
                if (data.msg === 'deleted') {
                    let newArtifacts = artifacts;
                    for (var i = 0; i < newArtifacts.length; i++) {
                        if (newArtifacts[i]._id === id) {
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
                        return data;
                    }
                })
                console.log('data:', data);

                setArtifacts(newArtifacts);
            })
            .catch(error => console.error('Error:', error));

    }
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

    function getSearchedArtifacts() {
        var url = window.location.href;
        var data = url.substring(url.lastIndexOf('/') + 1);
        var searchText = data.substring(0, data.length-1);
        if (artifacts !== undefined || artifacts !== [] || searchText !== '') {
            let newArtifact = artifacts.filter(
                (artifact) => {
                    return artifact.description.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
                }
           )
           return newArtifact;
        } else {
            return undefined;
        }
    }

    function search() {
        var searchedArtifacts = getSearchedArtifacts();
        if (searchedArtifacts.length === 0) {
            return (
                <div>
                    <h1>No Results for your search!</h1>
                </div>
            );
        } else {

            return (
                <div>
                <br></br>
                <h1>This is your search results! </h1>
                <br></br>
                    <PostList userProp={props.user} accessProp={updateAccessLevel} membersProp={familyMembers} viewProp='selected' artifacts={searchedArtifacts} editProp={editArtifact} commentProp={commentArtifact} deleteProp={deleteArtifact} />
                </div>
            )
        }
    }

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

    return (
        <div>

            <Header userProp={props.user} acceptFamilyProp={acceptFamily} />
            <div className="content-container">
                {search()}
            </div>
            <Footer />
        </div>
    )
}

export default SearchArtifacts;
