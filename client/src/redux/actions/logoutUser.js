import axios from 'axios';
import { server } from '../../server';

// load user
export const logoutUser = ({ token }) => async (dispatch) => {
    try {
        dispatch({ type: 'LogoutUserRequest' });

        const res = await axios.get(`${server}/auth/logout`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        });

        // expire cookie on client side by setting it to a date in the past
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        dispatch({
            type: 'LogoutUserRequestSuccess',
            payload: res.data.user,
        });

    } catch (err) {


        dispatch({
            type: 'LogoutUserRequestFailure',
            payload: err.message,
        });
    }
};