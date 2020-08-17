/* Purpose: Renders a posting form to post an artifact in home page. */

import React, { useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import UserListModal from '../../components/UserListModal';
import { ImageUpload } from '../FileUpload';
import { InputGroup, FormControl } from 'react-bootstrap';
import AddressAutocomplete from '../AddressAutocomplete';

function Posting(props) {

    // const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [time, setTime] = useState(new Date());
    const [chosenMembers, setChosenMembers] = useState([]);
    const [anonymous, setAnonymous] = useState('false');
    const [file, setFile] = useState(undefined);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    const [displayLocInput, setDisplayLocInput] = useState(false);
    const [displaySetting, setDisplaySetting] = useState(false);

    const [showEmptyError, setShowEmptyError] = useState(false);
    const [showFileTypeError, setShowFileTypeError] = useState(false);

    function getFile(value) {
        setFile(value);
    }

    function getChosenMembers(data) {
        setChosenMembers(data);
    }

    function hasExtension(exts) {
        return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$', "i")).test(file.name);
    }

    function clearField() {
        // setTitle('');
        setLocation('');
        setDescription('');
        setTime(new Date());
        setChosenMembers([]);
        setAnonymous('');
        // document.getElementById('myCheck').checked = false;
        setAnonymous('false');
        setImagePreviewUrl(null);
        setFile(undefined);
        document.getElementById("description").value = "";
        setShowEmptyError(false);
        setShowFileTypeError(false);
    }

    function handleSubmit() {
        if (file !== undefined && !hasExtension(['.jpg', '.gif', '.png', '.jpeg', '.svg']) ) {
            setShowFileTypeError(true);
        } else if (description === '') {
            setShowEmptyError(true);
        } else {
            var formData = new FormData();
            formData.append('time', time);
            // formData.append('title', title);
            formData.append('description', description);
            formData.append('owner', props.user._id);
            formData.append('location', location);
            formData.append('anonymous', anonymous);
            formData.append('artifactImage', file);
            if(chosenMembers.length !== 0) {
                let members = chosenMembers.map(e => {return(e._id)});
                console.log(members);
                formData.append('viewPermission', "selected");
                formData.append('viewBy', members);
            }

            props.func(formData);
            clearField();
        }
    }

    let locationInput = (
        <div className="mb-3">
            <AddressAutocomplete
                inputID="location"
                inputClass="post-item form-control"
                setAddress={address => setLocation(address)}
                setDisplayLocInput={ displayLocInput => setDisplayLocInput(displayLocInput) }
            />
        </div>
    );

    let settingInput = (
        <div className="row pb-3">
            <div className="col-6">
                <button
                    type="button"
                    className="button button-green mr-3"
                    onClick={ () => anonymous === "false" ? setAnonymous("true") : setAnonymous("false") }
                >
                    { anonymous === "false" ? "Anonymous" : "Unanonymous" }
                </button>
            </div>
            <div className="col-6">
                <UserListModal membersProp={props.membersProp} userProp={props.user} sendData={getChosenMembers}/>
            </div>

        </div>

    );

    let viewers = "all.";
    if (chosenMembers.length !== 0) {
        viewers = "";
        var member;
        for (member of chosenMembers) {
            viewers += member.nickName;
            viewers += ", ";
        }

        viewers = viewers.replace(/(, )$/, ".");
    }

    let imagePreview = null;
    if (imagePreviewUrl) {
        imagePreview = (
            <div className="image-preview">
                <img src={imagePreviewUrl} alt="Artifact Preview"></img>
            </div>
        )
    }

    return (
        <div className="container-fluid post-container mb-3">
            <form id="post-form">
                <div className="post-content">
                    <InputGroup className="mb-3">
                        <FormControl id="description" as="textarea" rows="4" placeholder="Share the story behind your artifact?" onChange={(e) => setDescription(e.target.value)}/>
                    </InputGroup>
                    {imagePreview}
                    <div className="post-info-section col-12 pb-3">
                        { anonymous === "false" ? "Is unanonymous, " : "Is anonymous, "}
                        { location  === ""      ? null : `in ${location}, `}
                        at {time.toDateString()},
                        and can be viewed by {viewers}
                    </div>
                    { displayLocInput ? locationInput : null }
                    { displaySetting  ? settingInput : null }
                </div>
                <div className="row">
                    <div className="icon-group col-md-8 col-sm-12 pb-3">
                        <ImageUpload
                            name="file"
                            id="file"
                            onChange={(e) => setFile(e.target.value)}
                            sendFile={getFile}
                            setImagePreview={(url) => setImagePreviewUrl(url)}
                        />
                        <div className="icon col-3">
                            <img src="/images/map.png" alt="location" onClick={() => setDisplayLocInput(!displayLocInput)} />
                        </div>
                        <div className="icon col-3">
                            <label>
                                <img src="/images/calendar.png" alt="calendar"/>
                                <DatePicker
                                    selected={time}
                                    onChange={(date => setTime(date))}
                                    className="hidden-input"
                                    id="time"
                                />
                            </label>
                        </div>
                        <div className="icon col-3">
                            <img src="/images/settings.png" alt="setting" onClick={() => setDisplaySetting(!displaySetting)}/>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-12 row pr-0 pb-3 justify-content-end">
                        <button className="button button-green" type="button" onClick={handleSubmit}>Post</button>
                    </div>
                </div>
                <div className="row">
                    {showEmptyError &&
                        (
                            <p style={{color: '#cc0000', position: 'relative', top: '-10px', left: '25px'}}>Error: Artifact story is missing.</p>
                        )
                    }

                </div>
                <div className="row">
                {showFileTypeError &&
                    (
                        <p style={{color: '#cc0000', position: 'relative', top: '-10px', left: '25px'}}>Error: File is not in the correct format.</p>
                    )
                }
                </div>
                <div className="row">
                {props.showSuccessProp &&
                    (
                        <p style={{color: '#4BCA81', position: 'relative', top: '-10px', left: '25px'}}>Success: You posted an artifact!</p>
                    )
                }
                </div>

            </form>
        </div>
    )

}

export default Posting;
