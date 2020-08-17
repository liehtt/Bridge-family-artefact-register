/* Purpose: Renders signup form or login form  */

import React, { useState } from 'react';
import {Form} from 'react-bootstrap';
function FormCenter(props) {
    return (
        <div className="form-center py-5">
            <div className="modal-dialog modal-dialog-centered">
                <div className="col-12">
                    <div className="modal-content">
                        <div className="col-12 form-logo text-center">
                            <img src={require('../static/images/logo.png')} alt="logo"></img>
                        </div>
                        { props.children }
                    </div>
                </div>
            </div>
        </div>

    );
}

function SignupForm(props) {

    const [validated, setValidated] = useState(false);
    const [password, setPassword] = useState("");

    const handleSubmit = event => {
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };

    return (
        <FormCenter>
            <Form className="col-12 row" method="POST" action="/signup" noValidate validated={validated} onSubmit={handleSubmit}>
                <div className="col-12">
                    <div className="form-group">
                        <label className="col-form-label">Email*</label>
                        <input type="email" id="email" name="email" className="form-control" placeholder="Email" required></input>
                        <Form.Control.Feedback type="invalid">
                            Please fill in your email address
                        </Form.Control.Feedback>
                    </div>
                </div>
                <div className="col-12">
                    <div className="form-group">
                        <label className="col-form-label">Password*</label>
                        <input type="password" id="password" name="password" className="form-control" placeholder="Password" required pattern=".{6,}" onChange={(event) => setPassword(event.target.value)}></input>
                        <Form.Control.Feedback type="invalid">
                            Passwords must be at least 6 characters long
                        </Form.Control.Feedback>
                    </div>
                </div>
                <div className="col-12">
                    <div className="form-group">
                        <label className="col-form-label">Confirm Password*</label>
                        <input type="password" id="confPwd" name="confPwd" className="form-control" placeholder="Confirm Password" required pattern={password}></input>
                        <Form.Control.Feedback type="invalid">
                            Passwords do not match with the first input
                        </Form.Control.Feedback>
                    </div>
                </div>
                <div className="col-md-6 col-12">
                    <div className="form-group">
                        <label className="col-form-label">First Name</label>
                        <input type="text" id="firstName" name="firstName" className="form-control" placeholder="First Name"></input>
                    </div>
                </div>
                <div className="col-md-6 col-12">
                    <div className="form-group">
                        <label className="col-form-label">Last Name</label>
                        <input type="text" id="lastName" name="lastName" className="form-control" placeholder="Last Name"></input>
                    </div>
                </div>
                <div className="col-md-6 col-12">
                    <div className="form-group">
                        <label className="col-form-label">Nick Name</label>
                        <input type="text" id="nickName" name="nickName" className="form-control" placeholder="Nick Name"></input>
                    </div>
                </div>
                <div className="col-md-6 col-12">
                    <div className="form-group">
                        <label className="col-form-label">Birthdate</label>
                        <input type="date" id="birthdate" name="birthdate" className="form-control"></input>
                    </div>
                </div>
                <div className="col-12 text-center">
                    <button className="button button-round button-green" type="submit">Signup</button>
                </div>
                <div className="col-12">
                    <div className="form-group text-center">
                        <span className="form-switcher" onClick={props.login}>Already have an account? | login</span>
                    </div>
                </div>
            </Form>
        </FormCenter>
    );
}

function LoginForm(props) {
    return (
        <FormCenter>
            <Form className="col-12" method="POST" action="/login">
                <div className="form-group">
                    <label>Email</label>
                    <input type='email' name='email' id ='email' className="form-control" required/>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type='password' name='password' id ='password' className="form-control" pattern = ".{6,}"
                    title = "Six or more characters" required/>
                </div>
                <div className="col-12 text-center">
                    <button className="button button-round button-green" type="submit">Login</button>
                </div>
                <div className="form-group text-center">
                    <span className="form-switcher" onClick={props.register}>Register</span>
                    <span> | </span>
                    <a className="form-switcher" href="/forgotPassword">Forgot your Password?</a>
                </div>
            </Form>
        </FormCenter>
    );
}

export { FormCenter, SignupForm, LoginForm };
