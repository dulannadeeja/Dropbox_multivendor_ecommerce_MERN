import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from "./reducers/user";
import { shopReducer } from "./reducers/shop.js";
import { productReducer } from "./reducers/product.js";
import { eventReducer } from "./reducers/event.js";
import { cartReducer } from "./reducers/cart.js";
import { wishlistReducer } from './reducers/wishlist';
import { orderReducer } from './reducers/order.js';
import { paymentReducer } from './reducers/payment.js';
import notificationReducer from './reducers/notification.js';

const store = configureStore({
    reducer: {
        user: userReducer,
        shop: shopReducer,
        product: productReducer,
        event: eventReducer,
        cart: cartReducer,
        // wishlist: wishlistReducer,
        order: orderReducer,
        payment: paymentReducer,
        notification: notificationReducer,
    }
});

export default store;