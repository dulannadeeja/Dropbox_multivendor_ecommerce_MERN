import axios from 'axios';
import { server } from '../../server';
export const loadProduct = ({ productId }) => async (dispatch) => {

    try {

        dispatch({ type: 'LoadProductRequest' });

        const res = await axios.get(`${server}/product/${productId}`);

        dispatch({
            type: 'LoadProductRequestSuccess',
            payload: res.data.product,
        });

        return res;

    } catch (err) {

        dispatch({
            type: 'LoadProductRequestFailure',
            payload: err.response.data.message,
        });

        return err;

    }
};