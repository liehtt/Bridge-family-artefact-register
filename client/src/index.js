/* This file is the source of access to the App */

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'mdbreact/dist/css/mdb.css';
import './index.css';
import App from './App/App';

render((
    <BrowserRouter>
        <App/>
    </BrowserRouter>
), document.getElementById('root'))
