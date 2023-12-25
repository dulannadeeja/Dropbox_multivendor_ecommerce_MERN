import { toast } from 'react-toastify';
import axios from 'axios';
import { server } from '../../server';


export const applyCoupon = ({ couponCode }) => async (dispatch, getState) => {
    try {

        console.log('couponCode', couponCode);

        dispatch({
            type: 'ApplyCouponRequest',
        });

        const cartItems = getState().cart.items;
        const token = getState().user.token;

        if (!token) return toast.error("Please login to apply coupon");

        const data = {
            cartItems
        };

        const config = {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
        };

        const res = await axios.post(
            `${server}/coupon/apply/${couponCode}`,
            data,
            config,
            { withCredentials: true }
        );

        if (res.status === 200) {

            dispatch({
                type: 'ApplyCouponSuccess',
                payload: { discount: res.data.discount, coupon: res.data.coupon },
            });
            toast.success('Coupon applied successfully');
        }

    } catch (err) {
        dispatch({
            type: 'ApplyCouponFail',
            payload: err.response?.data?.message,
        });
        toast.error(err.response?.data?.message || 'Error applying coupon');
        console.log(err);

    }
};
