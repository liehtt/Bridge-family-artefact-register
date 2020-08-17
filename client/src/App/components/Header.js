/* Purpose: Renders the header for pages. */

import React, { useState } from 'react';
import InviteRequestModal from './InviteRequestModal';
//import '../static/styles/header.css';
import '../static/sass/layout/header.scss';
import {Nav, Navbar, Form} from 'react-bootstrap';


function Header(props) {
    const [search, setSearch] = useState('');

    const [ isCollapse, setIsCollapse ] = useState(false);

    function handleLogOut(e) {
        e.preventDefault();

        fetch('/logout')
        .then(res => res.json())
        .then(res => {
            window.location.href = res.redirectUrl;
        });
    }

    return (
        <header>
            <Navbar className="nav-background" expand="lg">
                <Navbar.Brand href="/" className="logo">
                    <img src="/images/logo.png" alt="logo"></img>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setIsCollapse(!isCollapse)} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto col-xs-12 col-sm-12 col-md-7">
                        <Nav.Link href="/" className="nav-item">Home</Nav.Link>
                        <Nav.Link href="/profile" className="nav-item">Profile</Nav.Link>
                        <Nav.Link href="/family" className="nav-item">Family</Nav.Link>
                    </Nav>
                    
                    <Nav className="mr-auto col-xs-12 col-sm-12 col-md-4">

                        <Form inline className="my-0" action={`/search/${search}`} >
                            <input onChange={(e) => setSearch(e.target.value)} className="form-control mr-sm-2 search-bar" type="text" placeholder="Search" aria-label="Search" />
                            <button className="search-btn">
                                <span className='glyphicon glyphicon-search'></span>
                            </button>
                        </Form>

                    </Nav>

                    <Nav className="mr-auto col-xs-12 col-sm-12 col-md-1">
                        <div className="col-md-6 pl-0">
                            <InviteRequestModal userProp={props.userProp} acceptFamilyProp={props.acceptFamilyProp}/>
                        </div>
                        <div className="col-md-6 pl-0">
                            <img src="/images/logout.svg" alt="user" height="30px" width="30px" onClick={handleLogOut}/>
                        </div>
                    </Nav>

                </Navbar.Collapse>
            </Navbar>
      </header>
    )
}

export default Header;
