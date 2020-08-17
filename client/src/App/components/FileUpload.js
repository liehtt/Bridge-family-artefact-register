/* Purpose: Component for user to upload an image
            when creating a post or artifact */

import React from 'react';
// import '../static/styles/custom.css';

function FileUpload(props) {

    /* When the field content changes, change the state and
        send the changes to aprent prop. */
    function handleFileChange(e) {
        props.sendFile(document.querySelector('input[type="file"]').files[0]);
    }

        return (
            <div className="image-upload">
              <img src="/images/picture.png" alt="Upload File"/>
              <input
                type="file"
                className=""
                id="fileName"
                onChange={handleFileChange}
              />
            </div>
        )
}

function ImageUpload(props) {

    /* When the field content changes, change the state and
    send the changes to aprent prop. */
    function handleFileChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];

        if (file) {
            reader.onloadend = () => {
                props.sendFile(file);
                props.setImagePreview(reader.result);
            }

            reader.readAsDataURL(file);
        }
    }

    return (
        <div className="icon col-3">
            <img src="/images/picture.png" alt="Upload File"/>
            <input
            type="file"
            className="hidden-input"
            id="fileName"
            onChange={handleFileChange}
            />
        </div>
    )
}
export default FileUpload;
export { ImageUpload };
