
import { toast } from 'react-toastify';
import { createOrder } from './createOrder';



export const makeCashPayment = ({ orderData: order }) => async (dispatch, getState) => {
    try {

        dispatch({ type: 'SetPaymentMethod', payload: 'Cash On Delivery' });

        dispatch({
            type: 'MakePaymentPending',
        });

        order.paymentMethod = 'Cash On Delivery';

        toast.success("Payment Successfull");

        const res = await dispatch(createOrder({ order }));

        dispatch({
            type: 'MakePaymentSuccess',
        });

        return res;


    } catch (error) {

        dispatch({
            type: 'MakePaymentFail',
            payload: error.message,
        });
        return error;

    }
};
