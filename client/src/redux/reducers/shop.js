import { createReducer } from '@reduxjs/toolkit';
import STATUS from '../../constants/status';

const initialShopState = {
    shop: null,
    currentStatus: STATUS.IDLE,
    error: null,
};

export const shopReducer = createReducer(initialShopState, (builder) => {
    builder
        .addCase('LoadShopRequest', (state) => {
            state.currentStatus = STATUS.LOADING;
        })
        .addCase('LoadShopSuccess', (state, action) => {

            state.currentStatus = STATUS.SUCCESS;
            state.shop = action.payload;
        })
        .addCase('LoadShopFailure', (state, action) => {
            state.currentStatus = STATUS.FAILURE;
            state.error = action.payload;
        });
});