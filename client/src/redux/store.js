import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from "./reducers/user";
import { shopReducer } from "./reducers/shop.js";

const store = configureStore({
    reducer: {
        user: userReducer,
        shop: shopReducer,
    }
});

export default store;