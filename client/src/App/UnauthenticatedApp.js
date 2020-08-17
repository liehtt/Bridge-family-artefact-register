/* Purpose: Control the routes of unauthenticated user. Only allows access to
    Landing Page and Authentication Page to unauthenticated user */

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Landing from './pages/Landing';
import Authentication from './pages/Authentication';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function UnauthenticatedApp() {

    return (
        <Switch>
            <Route exact path='/' component={ Landing }/>
            <Route exact path="/authentication" component={ Authentication }/>
            <Route exact path='/forgotpassword' component={ ForgotPassword }/>
            <Route path='/reset/:token' component={ ResetPassword } />
        </Switch>
    )
}

export default UnauthenticatedApp;
