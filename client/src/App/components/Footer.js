/* Purpose: Renders a footer to show copyright symbol */

import React from 'react';
import Modal from 'react-bootstrap/Modal';
import '../static/sass/layout/footer.scss'
function Footer() {

    return (
        <Modal.Body className="footer" >
            &copy; {new Date().getFullYear()} Copyright: Bridge
        </Modal.Body>
    );
}

export default Footer;
