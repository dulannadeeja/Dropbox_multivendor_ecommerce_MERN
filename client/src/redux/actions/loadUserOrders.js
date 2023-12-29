import axios from 'axios';
import { server } from '../../server';
export const loadUserOrders = () => async (dispatch, getState) => {

    const token = getState().user.token;

    try {

        dispatch({ type: 'ORDER_LIST_REQUEST' });

        //make request to server
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const res = await axios.get(`${server}/order/all`, config, {
            withCredentials: true,
        });

        dispatch({
            type: 'ORDER_LIST_SUCCESS',
            payload: res.data.orders,
        });

        return res;

    } catch (err) {

        dispatch({
            type: 'ORDER_LIST_FAIL',
            payload: err.response.data.message,
        });

        return err;

    }
};