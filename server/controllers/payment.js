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

module.exports.createPaypalOrder = async (req, res, next) => {

    try {
        // use the cart information passed from the front-end to calculate the order amount detals
        const {
            cartTotal,
            items,
            coupon,
            isCouponApplied,
            couponDiscount,
            houseNumber,
            street,
            city,
            state,
            country,
            zip,
            phone,
            contactName,
        } = req.body;
        const { jsonResponse, httpStatusCode } = await createOrder({ cartTotal, items, coupon, isCouponApplied, couponDiscount, houseNumber, street, city, state, country, zip, phone, contactName });
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }

}

module.exports.capturePaypalPayment = async (req, res, next) => {
    const orderID = req.body.orderID;

    console.log("orderID passed from the frontend:", orderID);

    try {
        const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
        console.log("jsonResponse:", jsonResponse);
        console.log("httpStatusCode:", httpStatusCode);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to capture order." });
    }

}

const base = "https://api-m.sandbox.paypal.com";
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;


const generateAccessToken = async () => {
    try {
        if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
            throw new Error("MISSING_API_CREDENTIALS");
        }
        const auth = Buffer.from(
            PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
        ).toString("base64");
        const response = await fetch(`${base}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Failed to generate Access Token:", error);
    }
};

const createOrder = async ({
    cartTotal,
    items,
    coupon,
    isCouponApplied,
    couponDiscount,
    houseNumber,
    street,
    city,
    state,
    country,
    zip,
    phone,
    contactName,

}) => {
    console.log(
        "shopping cart information passed from the frontend createOrder() callback:",
        items,
    );

    const value = cartTotal - couponDiscount;

    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const payload = {
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: value,
                },
            },
        ],
    };

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
            // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
            // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
        },
        method: "POST",
        body: JSON.stringify(payload),
    });

    return handleResponse(response);
};

const captureOrder = async (orderID) => {

    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
            // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
            // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
        },
    });

    return handleResponse(response);
};

async function handleResponse(response) {
    try {
        const jsonResponse = await response.json();
        return {
            jsonResponse,
            httpStatusCode: response.status,
        };
    } catch (err) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
}