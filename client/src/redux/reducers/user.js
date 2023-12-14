import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    loading: false,
    userId: null,
    error: null,
};

export const userReducer = createReducer(initialState, (builder) => {
    builder
        .addCase('LoadUserRequest', (state) => {
            state.loading = true;
        })
        .addCase('LoadUserSuccess', (state, action) => {
            state.isAuthenticated = true;
            state.loading = false;
            state.userId = action.payload;
        })
        .addCase('LoadUserFailure', (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.userId = null;
        })
        .addCase('clearErrors', (state) => {
            state.error = null;
        });
});
