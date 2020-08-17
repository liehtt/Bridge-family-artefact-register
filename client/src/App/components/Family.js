/* Purpose: Shows the information of family and if user is group owner,
            renders a button for user to invite family members to
            join the group. */

import React from 'react';
import InviteButtonModal from '../components/InviteButtonModal';
import '../static/sass/pages/family.scss';

function Family(props) {

    /* Renders invitation button if user is group owner */
    function getInviteButton(role) {
        if (role === 'group owner') {
            return <InviteButtonModal familyProp={props.familyProp}/>
        }
    }

    if(!props.familyProp) {
        return <div> Loading... </div>

    } else {

        /* Process props data and generate useful information to be rendered */
        const members = props.familyProp.members;
        const owner = props.familyProp.owner;
        const user= props.userProp;

        let members_info = {
            names: [],
            avatars: [],
        }

        var role;
        const date = props.familyProp.dateofEstablish.slice(8, 10);
        const month = props.familyProp.dateofEstablish.slice(5, 7);
        const year = props.familyProp.dateofEstablish.slice(0, 4);

        if(owner.email === user.email){
            role = "group owner";
        }else{
            role = "group member";
        }

        if(members[0]){
            for(let i = 0; i < members.length; i++){
                members_info.names[i] = members[i].nickName;
                members_info.avatars[i] = members[i].avatar;
            }

        }else{
            members_info.avatars = [" "];
            members_info.emails = [" "];
        }

        return (
            <div className="container-fluid background">
                <div className="row">
                    <div className="col-12 px-0">
                        <div className ="row">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <p className="groupName">{props.familyProp.groupName}</p>
                                <div className='groupDescription' style={{marginBottom: '30px', borderStyle: 'solid', borderWidth: '1px', borderRadius: '6px', padding: '10px', borderColor: '#3b094a'}}>
                                    <p style={{fontSize: '20px'}}><strong>Group Description</strong></p>
                                    <p>{props.familyProp.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="row justify-content-center">
                            <div className = "col-lg-3 col-md-4 col-sm-1">
                                <p className="tag">Date of Establishment</p>
                                <p className="content text-center">{date}/{month}/{year}</p>
                                <p className="tag">Group Owner </p>
                                <p className="content text-center">{owner.nickName}</p>
                            </div>
                            <div className= "col-lg-3 col-md-4 col-sm-1">
                                <p className="tag">Number Of Members</p>
                                <p className="content text-center">{members.length}</p>
                                <p className="tag">You are a</p>
                                <p className="content text-center">{role}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-10 col-sm-12 text-center">
                        <img class="groupAvatar" src={props.familyProp.groupAvatar} alt="Group Avatar"></img>
                    </div>
                </div>

                <div className="row space text-center">
                    {members_info.avatars.map((avatar) => (
                        <div className="col-md-2 col-3">
                            <img src={avatar} className="AvatarImg rounded-circle-md" alt="member_avatar" width="80px"></img>
                        </div>
                    ))}
                </div>
                <div className="row">
                    {members_info.names.map((name) => (
                        <div className="col-md-2 col-3">
                            <p className="content text-center">{name}</p>
                        </div>
                    ))}
                </div>
                <div className="row">
                    {getInviteButton(role)}
                </div>
            </div>
        )
    }
}

export default Family;
