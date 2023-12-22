export const decreaseQuantity = ({ product }) => async (dispatch) => {
    try {
        dispatch({ type: 'UpdateCartRequest' });

        const existingItem = getState().cart.items.find(item => item.product._id === product._id);

        if (existingItem) {

            if (existingItem.quantity === 1) {
                dispatch({
                    type: 'DeleteFromCartSuccess'
                });
                dispatch({
                    type: 'DeleteFromCartSuccess',
                    payload: { product: existingItem.product },
                });
                return;
            }

            const newQuantity = Math.max(0, existingItem.quantity - 1);
            dispatch({
                type: 'UpdateCartSuccess',
                payload: { ...existingItem, quantity: newQuantity },
            });
        } else {
            // Handle the case when the item is not found in the cart
            dispatch({
                type: 'UpdateCartFailure',
                payload: 'Product not found in the cart.',
            });
        }

    } catch (err) {
        dispatch({
            type: 'UpdateCartFailure',
            payload: err.response.data.message,
        });
    }
};
