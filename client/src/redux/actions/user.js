import axios from 'axios';

// load user
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: 'LoadUserRequest' });

        const res = await axios.get('/auth/load-user', {
            withCredentials: true,
        });

        dispatch({
            type: 'LoadUserSuccess',
            payload: res.data.userId,
        });
    } catch (err) {
        dispatch({
            type: 'LoadUserFailure',
            payload: err.response.data.message,
        });
    }
};