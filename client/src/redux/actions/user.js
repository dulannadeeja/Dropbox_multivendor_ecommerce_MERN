import axios from 'axios';
import { server } from '../../server';

// load user
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: 'LoadUserRequest' });

        const res = await axios.get(`${server}/auth/load-user`, {
            withCredentials: true,
        });

        console.log(res);
        console.log(res.data.user);

        dispatch({
            type: 'LoadUserSuccess',
            payload: res.data.user,
        });

    } catch (err) {

        console.log("load user error catched from action" + err.message);

        dispatch({
            type: 'LoadUserFailure',
            payload: err.message,
        });
    }
};