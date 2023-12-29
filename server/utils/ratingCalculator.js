const getRatingsAddedProducts = (products) => {
    products.forEach(product => {
        product.ratings = getProductRatingByReviews(product.reviews);
    });

    products.forEach(product => {
        product.images.forEach(image => {
            if (image.isDefault) {
                product.defaultImage = image;
            }
        });
    });

    return products;
}

const getProductRatingByReviews = reviews => {
    let totalNumberOfReviews = 0;
    let sumOfAllRatings = 0;
    reviews.forEach(review => {
        totalNumberOfReviews++;
        sumOfAllRatings += review.rating;
    });
    const productRatings = totalNumberOfReviews === 0 ? 0 : sumOfAllRatings / totalNumberOfReviews;
    return productRatings || 0;
}

module.exports = {
    getRatingsAddedProducts,
    getProductRatingByReviews
}