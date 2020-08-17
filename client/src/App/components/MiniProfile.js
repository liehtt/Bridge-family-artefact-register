/* Purpose: Part of UserPanel (homepage) component, renders button for
            creating a family, and also shows user's avatar and nickname */

import React from 'react';
import FamilyForm from '../components/FamilyForm';
import '../static/sass/components/miniProfile.scss';

function MiniProfile(props) {
    return (
        <div className="card text-center">
            <div className="view overlay col-sm-14">
                <img className="card-img-top" src="https://mdbootstrap.com/img/Photos/Others/photo7.jpg" alt="card-cap"/>
                <img src={props.user.avatar} alt="profile-avatar" className="rounded-circle-lg mx-auto profileImg" />
                <a href="#!">
                    <div className="mask rgba-white-slight"></div>
                </a>
            </div>
            <div className="card-body col-sm-14">
                <h3 className="card-title text-center">{props.user.nickName}</h3>
                <FamilyForm createFamilyProp={props.createFamilyProp} />
            </div>
        </div>
     )
}

export default MiniProfile;
