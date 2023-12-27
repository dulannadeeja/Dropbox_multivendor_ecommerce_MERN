import axios from 'axios';
import { server } from '../../server'
import { toast } from 'react-toastify';
import { createOrder } from './createOrder';
import {
    CardNumberElement,
} from "@stripe/react-stripe-js";


export const makeStripePayment = ({ orderData: order, stripe, elements }) => async (dispatch, getState) => {
    try {

        dispatch({ type: 'SetPaymentMethod', payload: 'Stripe' });

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

        order.paymentMethod = 'Stripe';

        const { user } = getState().user;


        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
            },
        };

        const paymentData = {
            amount: (cartTotal - couponDiscount) * 100,
        };

        const { data } = await axios.post(
            `${server}/payment/process`,
            paymentData,
            config
        );

        const client_secret = data.client_secret;


        const result = await stripe.confirmCardPayment(client_secret, {
            payment_method: {
                card: elements.getElement(CardNumberElement),
            },
        });

        if (result.error) {
            toast.error(result.error.message);
            const error = result.error.message;
            throw new Error(error);
        }

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
