import React, { useState } from 'react';
import {Form} from 'react-bootstrap';

import { FormCenter } from '../components/Form';
import '../static/sass/pages/authentication.scss';
import '../static/sass/components/form.scss';
import '../static/sass/components/button.scss';
import '../static/sass/components/password.scss';

function ForgotPassword() {

    const [email, setEmail] = useState('');
    const [showError, setShowError] = useState(false);
    const [showEmptyError, setShowEmptyError] = useState(false);
    const [messageFromServer, setMessageFromServer] = useState('');

    function sendEmail() {
        if(email === '') {
            setShowError(false);
            setShowEmptyError(true);
            setMessageFromServer();
        } else {
            let jsonData = {email: email}
            fetch('/user/forgotPassword', {
                method: 'POST',
                body: JSON.stringify(jsonData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if(data.message === 'email-not-in-db') {
                    setShowError(true);
                    setShowEmptyError(false);
                    setMessageFromServer('');
                } else {
                    setShowError(false);
                    setShowEmptyError(false);
                    setMessageFromServer('recovery-email-sent');
                }
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

    return (
        <div id="main-page-background">
            <a class="arrow-image" href="/"><img src="/images/arrow.jpg" alt='arrow' width="80px"></img></a>

            <FormCenter>
                <Form className="col-12 form-container">
                    <div className="form-group">
                        <label>Email</label>
                        <input type='textarea' className="form-control" id='forgot-password-textarea' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email Address' />
                    </div>

                    <div className="form-group text-center">
                        <span className="form-switcher" id='forgot-password-button' onClick={sendEmail}>Sending Email</span>
                        <span> | </span>
                        <a className="form-switcher" href="/authentication">Login</a>
                    </div>



                    {showEmptyError && (
                        <div>
                            <p>Email address is empty</p>
                        </div>
                    )}
                    {showError && (
                        <div>
                            <p>
                                The email address does not exist. Please
                                try again.
                            </p>
                        </div>
                    )}
                    {messageFromServer === 'recovery-email-sent' && (
                        <div>
                            <p>Password Reset Email Successfully Sent!</p>
                        </div>
                    )}



                </Form>
            </FormCenter>

        </div>
    )
}

export default ForgotPassword;
