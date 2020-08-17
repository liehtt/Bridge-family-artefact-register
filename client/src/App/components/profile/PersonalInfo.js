/* Purpose: Part of Profile page component, renders fields for user to change
            its information if needed. Calls api '/user/updateUserInfo'
            if information is submitteed to made changes in database */

import React from 'react';

function PersonalInfo(props) {

    return (
        <div id="personalInfo" className="container-fluid">
            <div className="row flex-box align-items-center py-3">
                <div className="col-5 col-md-2">
                    <img src={props.user.avatar} alt="user avatar" className="rounded-circle-md" width="80px"/>
                </div>
                <div className="col-5 col-md-2">
                    <h3>{props.user.nickName}</h3>
                </div>
            </div>
            <div>
                <form method="POST" action="/user/updateUserInfo" encType="multipart/form-data">
                    <div className="row flex-box">
                        <div className="col-12 col-md-6">
                            <div className="form-group row">
                                <label className="col-6 col-lg-4 col-form-label">First Name</label>
                                <input type="text" id="firstName" name="firstName" className="form-control col-6 col-lg-6" placeholder={props.user.firstName}></input>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="form-group row">
                                <label className="col-6 col-lg-4 col-form-label">Last Name</label>
                                <input type="text" id="lastName" name="lastName" className="form-control col-6 col-lg-6" placeholder={props.user.lastName}></input>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="form-group row">
                                <label className="col-6 col-lg-4 col-form-label">Nick Name</label>
                                <input type="text" id="nickName" name="nickName" className="form-control col-6 col-lg-6" placeholder={props.user.nickName}></input>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="form-group row">
                                <label className="col-6 col-lg-4 col-form-label">Gender</label>
                                <select id="gender" className="form-control col-6 col-lg-6">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="form-group row">
                                <label className="col-6 col-lg-4 col-form-label">Birthdate</label>
                                <input type="date" id="birthdate" name="birthdate" className="form-control col-6 col-lg-6" placeholder={props.user.birthdate}></input>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="form-group row">
                                <label className="col-6 col-lg-4">Avatar</label>
                                <input type="file" id="userAvatar" name="userAvatar" className="form-control-file col-6 col-lg-6"></input>
                            </div>
                        </div>
                        <div className="col-12 py-3 row justify-content-end">
                            <button type="submit" className="btn btn-info">Update</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PersonalInfo;
