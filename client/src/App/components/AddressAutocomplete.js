import React, {useState, useEffect} from 'react';
import PlaceAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

function AddressAutocomplete(props) {

    const [address, setAddress] = useState("");

    useEffect(() => {
        props.setAddress(address);
    });

    function handleChange(address) {
        setAddress(address);
    }

    function handleSelect(address) {
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => console.log('Success', latLng))
            .catch(error => console.error('Error', error));
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            props.setDisplayLocInput(false);
        }
    }

    return (
        <PlaceAutocomplete value={address} onChange={handleChange} onSelect={handleSelect}>
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                    <input
                    {...getInputProps({
                        placeholder: 'Search Places ...',
                        className: props.inputClass,
                        id: props.inputID,
                        onKeyDown: handleKeyDown,
                    })}
                    id={props.inputID}
                    />
                    <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map(suggestion => {
                            const className = suggestion.active
                            ? 'suggestion-item--active'
                            : 'suggestion-item';
                            // inline style for demonstration purpose
                            const style = suggestion.active
                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                            : { backgroundColor: '#ffffff', cursor: 'pointer' };
                            return (
                            <div
                                {...getSuggestionItemProps(suggestion, {
                                className,
                                style,
                                })}
                            >
                                <span>{suggestion.description}</span>
                            </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </PlaceAutocomplete>
    );

};

export default AddressAutocomplete;