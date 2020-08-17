/* Purpose: Renders list of child components GroupListItem.js to show
            family groups joined or created */

import React from "react";
import GroupListItem from '../components/GroupListItem';

/* Show family groups if exists, else prompts
    a user to create a family group */
function GroupList(props) {

    if(props.familiesProp.length !== 0) {
        return (props.familiesProp.map((e, id) => {
            return (
                <GroupListItem familyProp={e} key={id} />
            )
        }))

    } else {
        return (
            <div className="col-12 text-center">
                <strong>Create a group for your family!</strong>
            </div>
        )
    }
}

export default GroupList;
