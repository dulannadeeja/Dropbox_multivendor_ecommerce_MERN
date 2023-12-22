import axios from 'axios';
import { server } from '../../server';
export const deleteEvent = ({ eventId, token }) => async (dispatch) => {

    try {
        dispatch({ type: 'DeleteEventRequest' });

        //make request to server
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axios.delete(
            `${server}/event/delete/${eventId}`,
            config
        );

        dispatch({
            type: 'DeleteEventRequestSuccess',
            payload: res.data,
        });

        console.log("Event deleted successfully.");
        return res.data;

    } catch (err) {
        dispatch({
            type: 'DeleteEventRequestFailure',
            payload: err.response.data.message,
        });
    }
};