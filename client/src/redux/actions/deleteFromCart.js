import { toast } from 'react-toastify';

export const deleteFromCart = ({ product }) => async (dispatch) => {
    try {
        dispatch({
            type: 'DeleteFromCart',
            payload: { ...product },
        });

        toast.success('Deleted from cart successfully');

    } catch (err) {

        toast.error('Error deleting from cart');
    }
};
