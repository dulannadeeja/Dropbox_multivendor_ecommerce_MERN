import openSocket from "socket.io-client";
import { toast } from 'react-toastify';
import { server } from '../../server';

export const updateNotifications = () => async (dispatch, getState) => {

    const { user } = getState().user;

    try {
        const socket = openSocket(server);

        // Handle socket connection
        socket.on("connect", () => {
            console.log("Socket connected");

            // Send the user ID to the server
            socket.emit("newUser", user._id);

            // Dispatch an action to update the Redux state with the connection status
            dispatch({ type: 'SOCKET_CONNECTED' });
        });

        // Handle socket disconnection
        socket.on("disconnect", () => {
            console.log("Socket disconnected");
            // Dispatch an action to update the Redux state with the disconnection status
            dispatch({ type: 'SOCKET_DISCONNECTED' });
        });

        // Handle the "order" event
        socket.on("order", ({ messageId, message, receiverId }) => {

            if (user) {
                if (user._id.toString() === receiverId) {
                    toast.success(message);
                }
            }

        });

    } catch (err) {
        console.error("Error connecting to Socket.IO:", err);
        // Optionally, dispatch an action to handle errors in the Redux state
        dispatch({ type: 'SOCKET_CONNECTION_ERROR', payload: err.message });
    }
};
