import { createReducer } from '@reduxjs/toolkit';
import STATUS from '../../constants/status';

const initialOrderState = {
    orders: [],
    order: {
        cartTotal: 0,
        totalAmount: 0,
        discountAmount: 0,
        couponDiscount: 0,
        coupon: null,
        isCouponApplied: false,
        items: [],
        paymentMethod: '',
        houseNumber: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        contactNumber: '',
        contactName: '',
    },
    orderStatus: STATUS.IDLE,
    orderError: null,
};

export const orderReducer = createReducer(initialOrderState, (builder) => {
    builder
        .addCase('ORDER_CREATE_REQUEST', (state) => {
            state.orderStatus = STATUS.LOADING;
        })
        .addCase('ORDER_CREATE_SUCCESS', (state, action) => {
            state.orderStatus = STATUS.SUCCEEDED;
            state.order = action.payload;
        })
        .addCase('ORDER_CREATE_FAIL', (state, action) => {
            state.orderStatus = STATUS.FAILED;
            state.orderError = action.payload;
        })
        .addCase('ORDER_LIST_REQUEST', (state) => {
            state.orders = [];
            state.orderStatus = STATUS.LOADING;
        })
        .addCase('ORDER_LIST_SUCCESS', (state, action) => {
            state.orderStatus = STATUS.SUCCEEDED;
            state.orders = action.payload;
        })
        .addCase('ORDER_LIST_FAIL', (state, action) => {
            state.orderStatus = STATUS.FAILED;
            state.orderError = action.payload;
        })

});