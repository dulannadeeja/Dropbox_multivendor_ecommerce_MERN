import axios from 'axios';
import { server } from '../../server';

// load user
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: 'LoadUserRequest' });

        const res = await axios.get(`${server}/auth/load-user`, {
            withCredentials: true,
        });

        dispatch({
            type: 'LoadUserSuccess',
            payload: res.data.user,
        });

    } catch (err) {

        console.log(err);

        dispatch({
            type: 'LoadUserFailure',
            payload: err.message,
        });
    }
};