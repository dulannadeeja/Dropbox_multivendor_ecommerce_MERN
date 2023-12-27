import { createReducer } from '@reduxjs/toolkit';
import STATUS from '../../constants/status';

const initialPaymentState = {
    paymentMethod: '',
    paymentStatus: STATUS.IDLE,
    paymentError: null,
};

export const paymentReducer = createReducer(initialPaymentState, (builder) => {
    builder
        .addCase('SetPaymentMethod', (state, action) => {
            state.paymentMethod = action.payload;
        })
        .addCase('MakePaymentPending', (state) => {
            state.paymentStatus = STATUS.PENDING;
        })
        .addCase('MakePaymentSuccess', (state) => {
            state.paymentStatus = STATUS.SUCCESS;
        })
        .addCase('MakePaymentFail', (state, action) => {
            state.paymentStatus = STATUS.FAIL;
            state.paymentError = action.payload;
        })
        .addCase('ResetPayment', (state) => {
            state.paymentStatus = STATUS.IDLE;
            state.paymentError = null;
        })

});