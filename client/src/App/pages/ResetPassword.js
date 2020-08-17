import React, { useState, useEffect } from 'react';
import {Form} from 'react-bootstrap';

import { FormCenter } from '../components/Form';
import '../static/sass/pages/authentication.scss';
import '../static/sass/components/form.scss';
import '../static/sass/components/button.scss';
import '../static/sass/components/password.scss';

function ResetPassword(props) {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [update, setUpdate] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [email, setEmail] = useState('');
    // const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        console.log(props.match.params.token);
        let jsonData = {token: props.match.params.token}
        fetch('/user/resetPassword', {
            method: 'POST',
            body: JSON.stringify(jsonData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.message === 'link-ok') {
                setEmail(data.user[0].email);
                // setUsername(data.user[0].nickName);
                setUserId(data.user[0]._id);
                setUpdate(false);
                setIsLoading(false);
                setError(false)
            } else {
                setUpdate(false);
                setIsLoading(false);
                setError(true);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    });

    function updatePassword() {
        if(password === '' || confirmPassword === '') {
            alert('missing info');
        } else if (password !== confirmPassword) {
            alert('different passwords!')
        } else {
            let jsonData = {email: email, id: userId, password: password}
            console.log('data:', jsonData);
            fetch('/user/updatePasswordViaEmail', {
                method: 'POST',
                body: JSON.stringify(jsonData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if(data.message === 'password-updated') {
                    setUpdate(true);
                    setError(false);
                } else {
                    setUpdate(false);
                    setError(true);
                }
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }

    if(error) {
        return (
            <div>
                <h4>Problem resetting password. Please send
                    another reset link</h4>
                <a className="form-switcher" href="/authentication">Home</a>
                <a className="form-switcher" href="/forgotpassword">Forgot Password?</a>
            </div>
        );
    } else if (isLoading) {
        return (
            <div>
                <p>Loading user data...</p>
            </div>
        );
    } else {
        return (


            <div id="main-page-background">
                <a class="arrow-image" href="/"><img src="/images/arrow.jpg" width="80px" alt='back-arrow'></img></a>

                <FormCenter>
                    <Form className="col-12 form-container">
                        <div className="form-group">
                            <label>Reset Password</label>
                            <input type='password' className="form-control" id='reset-password-textarea'
                            value={password} onChange={(e) => setPassword(e.target.value)} placeholder='ResetPassword' />
                        </div>

                        <div className="form-group">
                            <label>Repeat Password</label>
                            <input type='password' className="form-control" id='reset-confirmPassword-textarea'
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='RepeatPassword' />
                        </div>

                        <div className="form-group text-center">
                            <span className="form-switcher" id='reset-password-button' onClick={updatePassword}>ConfirmPassword</span>
                            <span> | </span>
                            <a className="form-switcher" href="/authentication">Login</a>
                            <span> | </span>
                            <a className="form-switcher" href="/">Landing</a>
                        </div>


                        {update && (
                            <div>
                                <p>
                                    Password has been successfully reset,
                                    please try logging in again.
                                </p>
                            </div>
                        )}
                    </Form>
                </FormCenter>
        </div>
        )
    }
}

export default ResetPassword;
