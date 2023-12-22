import { createReducer } from '@reduxjs/toolkit';
import STATUS from '../../constants/status';

const initialShopState = {
    error: null,
    events: null,
    eventStatus: STATUS.IDLE,
};

export const eventReducer = createReducer(initialShopState, (builder) => {
    builder
        .addCase('DeleteProductRequest', (state) => {
            state.eventStatus = STATUS.LOADING;
        })
        .addCase('LoadShopEventsSuccess', (state, action) => {
            state.error = null;
            state.eventStatus = STATUS.SUCCESS;
            state.events = action.payload;
        })
        .addCase('LoadShopEventsFailure', (state, action) => {
            state.eventStatus = STATUS.FAILURE;
            state.error = action.payload;
        })
        .addCase('DeleteEventRequest', (state) => {
            state.eventStatus = STATUS.LOADING;
        })
        .addCase('DeleteEventRequestSuccess', (state, action) => {
            state.eventStatus = STATUS.SUCCESS;
            state.error = null;
            console.log("evnt id comes to the reducer");
            state.events = state.events.filter(event => event._id !== action.payload.event);
        })
        .addCase('DeleteEventRequestFailure', (state, action) => {
            state.eventStatus = STATUS.FAILURE;
            state.error = action.payload;
        })

});