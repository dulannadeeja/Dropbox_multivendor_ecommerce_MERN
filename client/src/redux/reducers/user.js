import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    loading: false,
    user: null,
    error: null
};

export const userReducer = createReducer(initialState, (builder) => {
    builder
        .addCase('LoadUserRequest', (state) => {
            state.loading = true;
        })
        .addCase('LoadUserSuccess', (state, action) => {
            state.isAuthenticated = true;
            state.loading = false;
            state.user = action.payload;
            console.log("load user success from user reducer");
            console.log(action.payload);
        })
        .addCase('LoadUserFailure', (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
        })
        .addCase('clearErrors', (state) => {
            state.error = null;
        });
});
