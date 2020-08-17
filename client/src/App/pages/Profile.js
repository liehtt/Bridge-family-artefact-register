/* Purpose: Renders a profile page for user to manage its account, has three
            tabs on left sidebar, to switch the content rendered. Has
            PersonalInfo, AccountManage, and PersonalArtifacts as
            child components */

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PersonalInfo from '../components/profile/PersonalInfo';
import AccountManage from '../components/profile/AccountManage';
import PersonalArtifacts from '../components/profile/PersonalArtifacts';
import '../static/sass/pages/profile.scss';

const PERSONAL_INFO = "Personal Information";
const ACCOUNT_MANAGE = "Account Manage";
const PERSONAL_ARTIFACTS = "Personal Artifacts";

function Profile(props) {

    /* activeTab controls the content rendered */
    const [ activeTab, setActiveTab ] = useState(PERSONAL_INFO);

    function renderPage(activeTab) {
        switch(activeTab) {
            case PERSONAL_INFO:
                activeTab = <PersonalInfo user={props.user}/>;
                break;

            case PERSONAL_ARTIFACTS:
                activeTab = <PersonalArtifacts user={props.user}/>;
                break;

            case ACCOUNT_MANAGE:
                activeTab = <AccountManage user={props.user}/>;
                break;
            default:
                break;
        }

        return activeTab;
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
        })
        .catch(error => console.error('Error:', error));
    }

    return (

        <div>
            <Header userProp={props.user} acceptFamilyProp={acceptFamily}/>
            <div class="container-fluid content-container">
                <div class="row">
                    <aside class="col-12 col-md-2 p-0 text-center">
                        <nav class="navbar navbar-expand flex-md-column flex-row py-0">
                            <div class="collapse navbar-collapse">
                                <ul class="flex-md-column flex-row navbar-nav w-100 justify-content-between">
                                    <li class="nav-item">
                                        <div class="nav-link pl-0 h5 text" onClick={() => setActiveTab(PERSONAL_INFO)}>
                                            <i class="fa fa-heart codeply fa-fw"></i>
                                            <span>Information</span>
                                        </div>
                                    </li>

                                    <li class="nav-item">
                                        <div class="nav-link pl-0 h5 text" onClick={() => setActiveTab(ACCOUNT_MANAGE)}>
                                            <i class="fa fa-heart codeply fa-fw"></i>
                                            <span>Account</span>
                                        </div>
                                    </li>

                                    <li class="nav-item">
                                        <div class="nav-link pl-0 h5 text" onClick={() => setActiveTab(PERSONAL_ARTIFACTS)}>
                                            <i class="fa fa-heart codeply fa-fw"></i>
                                            <span>Artifacts</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </aside>
                    <main class="col bg-faded p-0">
                        <div className="col-10">
                            {renderPage(activeTab)}
                        </div>
                    </main>
                </div>
            </div>

        <Footer />
        </div>
    )
}

export default Profile;
