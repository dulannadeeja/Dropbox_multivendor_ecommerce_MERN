import axios from 'axios';
import { server } from '../../server';
export const loadShopEvents = ({ shopId, token }) => async (dispatch) => {

    try {
        dispatch({ type: 'LoadShopEventsRequest' });

        //make request to server
        const res = await axios.get(
            `${server}/event/all/${shopId}`,
        );

        dispatch({
            type: 'LoadShopEventsSuccess',
            payload: res.data.events,
        });
    } catch (err) {

        dispatch({
            type: 'LoadShopEventsFailure',
            payload: err.response.data.message,
        });
    }
};