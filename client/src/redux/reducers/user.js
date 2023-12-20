import { createReducer } from '@reduxjs/toolkit';
import STATUS from '../../constants/status';

const initialState = {
    isAuthenticated: false,
    currentStatus: STATUS.IDLE,
    user: null,
    error: null,
    isSeller: false,
    isAdmin: false,
    shop: null,
    token: null,
};

export const userReducer = createReducer(initialState, (builder) => {
    builder
        .addCase('LoadUserRequest', (state) => {
            state.currentStatus = STATUS.LOADING;
        })
        .addCase('LoadUserSuccess', (state, action) => {
            state.isAuthenticated = true;
            state.currentStatus = STATUS.SUCCESS;
            state.user = action.payload;
            state.isSeller = action.payload.isSeller;
            state.isAdmin = action.payload.isAdmin;
            state.shop = action.payload.shop;
            state.token = action.payload.token;
        })
        .addCase('LoadUserFailure', (state) => {
            console.log("load user failure action dispatched");
            state.isAuthenticated = false;
            state.currentStatus = STATUS.FAILURE;
        })
        .addCase('clearErrors', (state) => {
            state.error = null;
        })
        .addCase('LOGOUT', (state) => {
            state.isAuthenticated = false;
            state.currentStatus = STATUS.IDLE;
            state.user = null;
            state.isSeller = false;
            state.isAdmin = false;
            state.shop = null;
            state.token = null;
        })
});
