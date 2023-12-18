import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    loading: false,
    user: null,
    error: null,
    isSeller: false,
    isAdmin: false,
    shop: null
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
            state.isSeller = action.payload.isSeller;
            state.isAdmin = action.payload.isAdmin;
            state.shop = action.payload.shop;
        })
        .addCase('LoadUserFailure', (state) => {
            state.loading = false;
            state.isAuthenticated = false;
        })
        .addCase('clearErrors', (state) => {
            state.error = null;
        });
});
