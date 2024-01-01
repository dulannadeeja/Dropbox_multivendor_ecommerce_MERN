import axios from 'axios';
import { server } from '../../server';
export const loadShop = (shopId) => async (dispatch) => {

    try {
        dispatch({ type: 'LoadShopRequest' });

        //make request to server
        const res = await axios.get(`${server}/shop/${shopId}`, {
            withCredentials: true,
        });

        dispatch({
            type: 'LoadShopSuccess',
            payload: res.data.shop,
        });
    } catch (err) {

        dispatch({
            type: 'LoadShopFailure',
            payload: err.response.data.message,
        });
    }
};