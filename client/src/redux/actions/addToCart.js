import { toast } from 'react-toastify';

export const addToCart = ({ product, quantity }) => async (dispatch, getState) => {
    try {

        const existingItem = getState().cart.items.find(item => item._id === product._id);

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;

            dispatch({
                type: 'UpdateCart',
                payload: { ...product, quantity: newQuantity },
            });

            toast.success('Cart updated successfully');
        } else {
            dispatch({
                type: 'AddToCart',
                payload: { ...product, quantity },
            });

            toast.success('Added to cart successfully');
        }

    } catch (err) {
        toast.error('Error adding to cart');
        console.log(err);
    }
};
