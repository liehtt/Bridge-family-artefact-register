/* Purpose: An edit button component for every post/artifact
            to allow user to edit its artifact. */

/* When a user clicks the edit button of a post, textbox will show up
    for user to fill in the changes, saving the changes will make
    the changes permanent. */

import React, { useState } from 'react';

function Editing(props) {

    /* isEditing controls the state of edit button,
        if true, textarea is displayed to be filled */
    const [ isEditing, setIsEditing ] = useState(false);

    /* text state keeps track of the content of textarea */
    const [ text, setText ] = useState('');

    /* Invokes prop function (api) with text content
        and artifactId as params */
    function handleSubmit() {
        var data = {
            id: props.idProp,
            text: text
        }
        props.editProp(data);
        setIsEditing(false);
    }

    if(isEditing) {
        //setText(props.text);
        return (
            <div>
                <textarea onChange={(e) => setText(e.target.value)} value={text} type="text" name="edit"/>
                <button type="button" onClick={handleSubmit}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
        )

    } else {
        return (
            <div>
                <button onClick={() => {setIsEditing(true); setText(props.text);}}>Edit</button>
            </div>
        )
    }
}

export default Editing;
