import axios from 'axios';
import { server } from '../../server'
import { toast } from 'react-toastify';

export const createOrder = ({ order }) => async (dispatch, getState) => {
    try {

        const token = getState().user.token;

        dispatch({ type: 'ORDER_CREATE_REQUEST' });


        const newForm = new FormData();
        newForm.append('cartTotal', order.cartTotal);
        newForm.append('couponDiscount', order.couponDiscount);
        newForm.append('coupon', order.coupon);
        newForm.append('isCouponApplied', order.isCouponApplied);
        newForm.append('items', JSON.stringify(order.items));
        newForm.append('paymentMethod', order.paymentMethod || 'paypal');
        newForm.append('houseNumber', order.houseNumber);
        newForm.append('street', order.street);
        newForm.append('city', order.city);
        newForm.append('state', order.state);
        newForm.append('zip', order.zip);
        newForm.append('country', order.country);
        newForm.append('contactNumber', order.phone);
        newForm.append('contactName', order.contactName);


        const res = await axios.post(`${server}/order/create`,
            newForm,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
            { withCredentials: true });

        dispatch({ type: 'ORDER_CREATE_SUCCESS', payload: res.data });
        return res;

    } catch (error) {

        console.log(error);

        dispatch({
            type: 'ORDER_CREATE_FAIL',
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });

        toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);

        return error;

    }
};
