import { createReducer } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const initialWishlistState = {
    items: [],
};

export const wishlistReducer = createReducer(initialWishlistState, (builder) => {
    builder
        .addCase('LoadWishlist', (state) => {
            // Load wishlist from local storage
            const wishlist = localStorage.getItem('wishlist');
            if (wishlist) {

                // filter empty objects from wishlist
                const filteredWishlist = JSON.parse(wishlist).filter(item => Object.keys(item).length !== 0);

                // filter items with quantity 0
                const filteredWishlist2 = filteredWishlist.filter(item => item.quantity !== 0);

                // update wishlist in redux store
                state.items = filteredWishlist2;

                // update wishlist in local storage
                localStorage.setItem('wishlist', JSON.stringify(filteredWishlist2));
            }

        })
        .addCase('AddToWishlist', (state, action) => {
            const updatedWishlist = [...state.items, action.payload];
            state.items = updatedWishlist;
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
            toast.success('Added to wishlist successfully');
        })
        .addCase('DeleteFromWishlist', (state, action) => {
            const updatedWishlist = state.items.filter(item => item._id !== action.payload._id);
            state.items = updatedWishlist;
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
            toast.success('Deleted from wishlist successfully');
        })

});