import axios from 'axios';
import { server } from '../../server';
export const loadShopProducts = ({ shopId }) => async (dispatch) => {

    try {
        dispatch({ type: 'LoadShopProductsRequest' });

        //make request to server

        const res = await axios.get(
            `${server}/shop/products/${shopId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        );

        dispatch({
            type: 'LoadShopProductsSuccess',
            payload: res.data.products,
        });
    } catch (err) {

        dispatch({
            type: 'LoadShopProductsFailure',
            payload: err.response.data.message,
        });
    }
};