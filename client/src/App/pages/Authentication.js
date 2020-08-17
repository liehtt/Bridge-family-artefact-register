/* Purpose: Renders a login form or signup form depending on the user */

import React, { useState } from 'react';
import { LoginForm, SignupForm } from '../components/Form';
import '../static/sass/pages/authentication.scss';

function Authentication(props) {

    const [ displayLogin, setDisplayLogin ] = useState(true);

    function handleClickLogin() {
        setDisplayLogin(true);
    }

    function handleClickRegister() {
        setDisplayLogin(false);
    }

    return (
        <div id="main-page-background">
            <a class="arrow-image" href="/"><img src="/images/arrow.jpg" width="80px" alt='arrow'></img></a>       
            { displayLogin ? <LoginForm register={handleClickRegister}/> : <SignupForm login={handleClickLogin}/> }
        </div>
    );
}

export default Authentication;
