
import { createReducer } from '@reduxjs/toolkit';

// Initial state
const initialState = {
    notifications: [],
    socketConnected: false,
    socketConnectionError: null,
};

// Reducer function
const notificationReducer = createReducer(initialState, (builder) => {
    builder
        .addCase('ADD_NOTIFICATION', (state, action) => {
            state.notifications.push(action.payload);
        })
        .addCase('SOCKET_CONNECTED', (state) => {
            state.socketConnected = true;
        })
        .addCase('SOCKET_DISCONNECTED', (state) => {
            state.socketConnected = false;
        })
        .addCase('SOCKET_CONNECTION_ERROR', (state, action) => {
            state.socketConnectionError = action.payload;
        })
        .addCase('CLEAR_NOTIFICATIONS', (state) => {
            state.notifications = [];
        })
});

export default notificationReducer;
