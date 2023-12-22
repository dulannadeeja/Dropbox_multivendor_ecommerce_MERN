import { createReducer } from '@reduxjs/toolkit';
import STATUS from '../../constants/status';

const initialShopState = {
    error: null,
    product: null,
    productStatus: STATUS.IDLE,
};

export const productReducer = createReducer(initialShopState, (builder) => {
    builder
        .addCase('DeleteProductRequest', (state) => {
            state.productStatus = STATUS.LOADING;
        })
        .addCase('DeleteProductRequestSuccess', (state, action) => {
            state.error = null;
            state.productStatus = STATUS.SUCCESS;
            state.product = action.payload;
        })
        .addCase('DeleteProductRequestFailure', (state, action) => {
            state.productStatus = STATUS.FAILURE;
            state.error = action.payload;
        })

});