const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
module.exports.processPayment = async (req, res, next) => {

    const amount = req.body.amount;


    const myPaymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: { company: 'dropbox' },
    });

    if (!myPaymentIntent) {
        return res.status(500).json({
            success: false,
            message: 'Error in creating payment intent',
        });
    }

    res.status(200).json({
        success: true,
        client_secret: myPaymentIntent.client_secret,
    });
}

module.exports.getStripeKey = async (req, res, next) => {
    res.status(200).json({
        success: true,
        stripe_key: process.env.STRIPE_PUBLIC_KEY,
    });
}