/* Purpose:  Renders form for user to change the account's
             password if needed. */

/* User fills in their current password to check if its truly
    the user, then fills in the the new password two times
    for confirmation  */

import React from 'react';

function AccountManage() {
    return (
        <div className="container-fluid">
            <div className="row text-center">
                <div className="col-md-10 col-12 py-3">
                    <h3>Change Password</h3>
                </div>
            </div>

            {/* Calls the api '/user/updatePassword' when submit button is clicked */}
            <form method="POST" action="/user/updatePassword">
                <div className="row">
                    <div className="col-12">
                        <div className="form-group row justify-content-center">
                            <label className="col-12 col-lg-8" style={{marginRight: '15px'}}>Current Password:</label>
                            <input className="form-control col-12 col-lg-8" style={{textIndent: '10px'}} type="password" id="currPwd" name="currPwd" placeholder="Current Password"></input>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="form-group row justify-content-center">
                            <label className="col-12 col-lg-8" style={{marginRight: '15px'}}>New Password:</label>
                            <input className="form-control col-12 col-lg-8" style={{textIndent: '10px'}} type="password" id="newPwd" name="newPwd" placeholder="New Password"></input>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="form-group row justify-content-center">
                            <label className="col-12 col-lg-8" style={{marginRight: '15px'}}>Confirm Password:</label>
                            <input className="form-control col-12 col-lg-8" style={{textIndent: '10px'}} type="password" id="confPwd" name="confPwd" placeholder="Confirm Password"></input>
                        </div>
                    </div>
                    <div className="col-12 py-3 row justify-content-end">
                        <button type="submit" className="btn btn-info">Update</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AccountManage;
