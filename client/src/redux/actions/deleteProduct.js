import axios from 'axios';
import { server } from '../../server';
export const deleteProduct = ({ productId, token }) => async (dispatch) => {

    try {
        dispatch({ type: 'DeleteProductRequest' });

        //make request to server
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axios.delete(
            `${server}/product/delete/${productId}`,
            config
        );



        dispatch({
            type: 'DeleteProductRequestSuccess',
            payload: 'Product deleted successfully.',
        });
        return res.data;

    } catch (err) {
        dispatch({
            type: 'DeleteProductRequestFailure',
            payload: err.response.data.message,
        });
    }
};