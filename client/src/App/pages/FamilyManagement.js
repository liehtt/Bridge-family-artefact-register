/* Purpose: Renders a family management page, showing the lists of families
            joined as tabs on sidebar and can choose which family to view
            by clicking on one of the tabs */

import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Family from '../components/Family';

function FamilyManagement(props) {

    /* Stores the fetched family data */
    const [ families, setFamilies ] = useState([]);
    /* Store the family that is being selected and viewed */
    const [ activeFamily, setActiveFamily ] = useState('starting');
    const [ isLoading, setIsLoading ] = useState(true);
    const [ user, setUser] = useState({});

    /* Fetch the family data after rendering the component to be processed */
    useEffect(() => {
        fetch('/user/families')
        .then(res => res.json())
        .then(families => {
            setActiveFamily(families[0])
            setFamilies(families);
            setIsLoading(false);
        })

        fetch('/user')
        .then(res => res.json())
        .then(data => {
            setUser(data);
        })
    }, [])

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

    if (isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }
    if(families.length === 0){
        return (
            <div>
                <Header userProp={user} acceptFamilyProp={acceptFamily} />
                <div>There's no family group.</div>
                <Footer />
            </div>
        )
    }
    else {
        return (

            <div>
                <Header userProp={user} acceptFamilyProp={acceptFamily} />
                <div class="container-fluid content-container">
                    <div class="row">
                        <aside class="col-12 col-md-2 p-0 text-center">
                            <nav class="navbar navbar-expand flex-md-column flex-row py-0">
                                <div class="collapse navbar-collapse">
                                    <ul class="flex-md-column flex-row navbar-nav w-100 justify-content-between">
                                            {families.map(e => {
                                                return (
                                                    <li class="nav-item">
                                                        <div class="nav-link pl-0 h5 text" key={e._id} onClick={() => setActiveFamily(e)}>
                                                            <i class="fa fa-heart codeply fa-fw"></i>
                                                            <span class="font-weight-bold">{e.groupName}</span>
                                                        </div>
                                                    </li>
                                                )
                                            })}
                                    </ul>
                                </div>
                            </nav>
                        </aside>
                        <main class="col bg-faded p-0">
                            <Family userProp={props.user} familyProp={activeFamily} />
                        </main>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default FamilyManagement;
