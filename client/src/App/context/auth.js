import React from 'react';

function useUser() {
    return fetch('/api/validateLogin')
    .then(res => res.json())
    .then(data => {
        if (data.result.isLoggedIn) {
            return fetch(`users/${data.session.userID}`)
            .then(res => res.json())
            .then(user => {
                return user;
            });
        } else {
            return null;
        }
    });
}

export { useUser };
