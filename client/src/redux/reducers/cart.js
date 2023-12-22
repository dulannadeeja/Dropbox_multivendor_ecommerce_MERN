import { createReducer } from '@reduxjs/toolkit';
import STATUS from '../../constants/status';

const initialCartState = {
    items: [],
    cartTotal: 0,
};

export const cartReducer = createReducer(initialCartState, (builder) => {
    builder
        .addCase('LoadCart', (state) => {
            // Load cart from local storage
            const cart = localStorage.getItem('cart');
            if (cart) {

                // filter empty objects from cart
                const filteredCart = JSON.parse(cart).filter(item => Object.keys(item).length !== 0);

                // filter items with quantity 0
                const filteredCart2 = filteredCart.filter(item => item.quantity !== 0);

                // update cart in redux store
                state.items = filteredCart2;

                // update cart total
                let cartTotal = 0;
                state.items.forEach(item => {
                    cartTotal += item.quantity * item.discountPrice;
                });
                state.cartTotal = cartTotal;

                // update cart in local storage
                localStorage.setItem('cart', JSON.stringify(filteredCart2));
            }

        })
        .addCase('AddToCart', (state, action) => {
            const updatedCart = [...state.items, action.payload];
            state.items = updatedCart;
            let cartTotal = 0;
            updatedCart.forEach(item => {
                cartTotal += item.quantity * item.discountPrice;
            });
            state.cartTotal = cartTotal;
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        })
        .addCase('DeleteFromCart', (state, action) => {
            const updatedCart = state.items.filter(item => item._id !== action.payload._id);
            state.items = updatedCart;

            let cartTotal = 0;
            updatedCart.forEach(item => {
                cartTotal += item.quantity * item.discountPrice;
            });
            state.cartTotal = cartTotal;

            localStorage.setItem('cart', JSON.stringify(updatedCart));
        })
        .addCase('UpdateCart', (state, action) => {
            const updatedCart = state.items.map(item => item._id === action.payload._id ? action.payload : item);
            state.items = updatedCart;
            let cartTotal = 0;
            updatedCart.forEach(item => {
                cartTotal += item.quantity * item.discountPrice;
            });
            state.cartTotal = cartTotal;
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        })
        .addCase('IncreaseCartQuantity', (state, action) => {

            console.log('action.payload', action.payload);

            const updatedCart = state.items.map(item => {
                if (item._id === action.payload._id) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });
            state.items = updatedCart;

            let cartTotal = 0;
            updatedCart.forEach(item => {
                cartTotal += item.quantity * item.discountPrice;
            });
            state.cartTotal = cartTotal;

            localStorage.setItem('cart', JSON.stringify(updatedCart));
        })
        .addCase('DecreaseCartQuantity', (state, action) => {
            const updatedCart = state.items.map(item => {
                if (item._id === action.payload._id) {
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            });
            state.items = updatedCart;

            let cartTotal = 0;
            updatedCart.forEach(item => {
                cartTotal += item.quantity * item.discountPrice;
            });
            state.cartTotal = cartTotal;

            localStorage.setItem('cart', JSON.stringify(updatedCart));
        })

});