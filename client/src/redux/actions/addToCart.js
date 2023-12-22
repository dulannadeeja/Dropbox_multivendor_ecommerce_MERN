export const addToCart = ({ product, quantity }) => async (dispatch, getState) => {
    try {

        const existingItem = getState().cart.items.find(item => item._id === product._id);

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;

            dispatch({
                type: 'UpdateCart',
                payload: { ...product, quantity: newQuantity },
            });
        } else {
            dispatch({
                type: 'AddToCart',
                payload: { ...product, quantity },
            });
        }

    } catch (err) {
        console.log(err);
    }
};
