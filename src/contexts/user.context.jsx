import { createContext, useState, useEffect, useReducer } from "react";

import {
    onAuthStateChangedListener,
    createUserDocumentFromAuth,
} from "../utils/firebase/firebase.utils";

export const UserContext = createContext({
    setCurrentUser: () => null,
    currentUser: null,
});

const USER_ACTION_TYPE = {
    SET_CURRENT_USER: "SET_CURRENT_USER",
};

const userReducer = (state, action) => {
    switch (action.type) {
        case USER_ACTION_TYPE.SET_CURRENT_USER:
            return { ...state, currentUser: action.payload };
        default:
            throw new Error(`Unhandled this action type ${action.type}`);
    }
};
const initialState = { currentUser: null };

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener((user) => {
            if (user) {
                createUserDocumentFromAuth(user);
            }
            dispatch({
                type: USER_ACTION_TYPE.SET_CURRENT_USER,
                payload: user,
            });
        });

        return unsubscribe;
    }, []);
    const value = { state };
    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};
