const { getRatingsAddedProducts, getProductRatingByReviews } = require('../utils/ratingCalculator');

describe('Rating Calculator', () => {
    describe('getRatingsAddedProducts', () => {
        it('should calculate ratings for all products based on reviews', () => {
            const products = [
                {
                    id: 1,
                    name: 'Product 1',
                    reviews: [
                        { rating: 4 },
                        { rating: 5 },
                        { rating: 3 },
                    ],
                    images: [{ isDefault: true, url: 'image1.jpg' }],
                },
                {
                    id: 2,
                    name: 'Product 2',
                    reviews: [
                        { rating: 2 },
                        { rating: 4 },
                        { rating: 5 },
                    ],
                    images: [{ isDefault: true, url: 'image2.jpg' }],
                },
            ];

            const productsWithRatings = getRatingsAddedProducts(products);

            expect(productsWithRatings).toHaveLength(products.length);
            expect(productsWithRatings[0]).toHaveProperty('ratings', 4);
            expect(productsWithRatings[1].ratings).toBeCloseTo(3.67, 2);
        });

        it('should handle products with no reviews', () => {
            const products = [
                {
                    id: 1,
                    name: 'Product 1',
                    reviews: [],
                    images: [{ isDefault: true, url: 'image1.jpg' }],
                },
                {
                    id: 2,
                    name: 'Product 2',
                    reviews: [],
                    images: [{ isDefault: true, url: 'image2.jpg' }],
                },
            ];

            const productsWithRatings = getRatingsAddedProducts(products);

            expect(productsWithRatings).toHaveLength(products.length);
            expect(productsWithRatings[0]).toHaveProperty('ratings', 0);
            expect(productsWithRatings[1]).toHaveProperty('ratings', 0);
        });
    });

    describe('getProductRatingByReviews', () => {
        it('should calculate the average rating based on reviews', () => {
            const reviews = [
                { rating: 4 },
                { rating: 5 },
                { rating: 3 },
            ];

            const productRating = getProductRatingByReviews(reviews);

            expect(productRating).toBe(4);
        });

        it('should handle empty reviews array', () => {
            const reviews = [];

            const productRating = getProductRatingByReviews(reviews);

            expect(productRating).toBe(0);
        });
    });
});
