import axios from 'axios';
import { server } from '../../server';
export const loadShop = (shopId) => async (dispatch) => {

    console.log("load shop action" + shopId);

    try {
        dispatch({ type: 'LoadShopRequest' });

        //make request to server
        const res = await axios.get(`${server}/shop/${shopId}`, {
            withCredentials: true,
        });

        console.log("shop id" + shopId);
        console.log(res);

        dispatch({
            type: 'LoadShopSuccess',
            payload: res.data.shop,
        });
    } catch (err) {


        console.log("error" + err);

        dispatch({
            type: 'LoadShopFailure',
            payload: err.response.data.message,
        });
    }
};