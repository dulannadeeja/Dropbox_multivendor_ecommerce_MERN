import axios from 'axios';
import { server } from '../../server'
import { toast } from 'react-toastify';
import { createOrder } from './createOrder';
import {
    CardNumberElement,
} from "@stripe/react-stripe-js";


export const makeCashPayment = ({ orderData: order }) => async (dispatch, getState) => {
    try {

        dispatch({ type: 'SetPaymentMethod', payload: 'Cash On Delivery' });

        dispatch({
            type: 'MakePaymentPending',
        });

        let {
            cartTotal,
            items,
            coupon,
            isCouponApplied,
            couponDiscount,
            houseNumber,
            street,
            city,
            state,
            country,
            zip,
            phone,
            contactName,
        } = order;

        order.paymentMethod = 'Cash On Delivery';

        const { user } = getState().user;

        toast.success("Payment Successfull");

        dispatch({
            type: 'MakePaymentSuccess',
        });

        const res = await dispatch(createOrder({ order }));

        return res;


    } catch (error) {

        dispatch({
            type: 'MakePaymentFail',
            payload: error.message,
        });

        console.log(error);
        return error;

    }
};
