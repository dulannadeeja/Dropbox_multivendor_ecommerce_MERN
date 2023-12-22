export const deleteFromCart = ({ product }) => async (dispatch) => {
    try {
        console.log("deleteFromCart action called");
        console.log(product);
        dispatch({
            type: 'DeleteFromCart',
            payload: { ...product },
        });

    } catch (err) {
        console.log(err);
    }
};
