/* Purpose: Individual child component of GroupList.js, renders
    a family's group name and family's members */

import React, { useState } from "react";
import { Collapse } from 'react-bootstrap';

function GroupListItem(props) {

    /* collapseId controls if the column of members collapse
        (shrinks and only show the group name) */
    const [open, setOpen] = useState(false);

    return (
        <div className="accordion md-accordion" id="accordionEx" role="tablist" aria-multiselectable="true">
            <div className="card">
                <div className="card-header" role="tab" id="headingOne1">
                    <a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapseOne1"
                        aria-controls="collapseOne1" onClick={() => setOpen(!open)}
                        aria-expanded={open}>
                        <h5 className="mb-0 text-center">
                            {props.familyProp.groupName}
                        </h5>
                    </a>
                </div>
                <Collapse in={open}>
                    <div id="example-collapse-text" className="text-center">
                        {props.familyProp.members.map(e => {
                            return (<p key={e._id}>{e.nickName}</p>)
                        })}
                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default GroupListItem;
