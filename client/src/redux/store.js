import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from "./reducers/user";
import { shopReducer } from "./reducers/shop.js";
import { productReducer } from "./reducers/product.js";
import { eventReducer } from "./reducers/event.js";
import { cartReducer } from "./reducers/cart.js";

const store = configureStore({
    reducer: {
        user: userReducer,
        shop: shopReducer,
        product: productReducer,
        event: eventReducer,
        cart: cartReducer,
    }
});

export default store;