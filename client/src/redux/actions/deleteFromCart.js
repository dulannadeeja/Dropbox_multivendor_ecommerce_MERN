import { toast } from 'react-toastify';

export const deleteFromCart = ({ product }) => async (dispatch) => {
    try {
        console.log("deleteFromCart action called");
        console.log(product);
        dispatch({
            type: 'DeleteFromCart',
            payload: { ...product },
        });

        toast.success('Deleted from cart successfully');

    } catch (err) {

        toast.error('Error deleting from cart');
        console.log(err);
    }
};
