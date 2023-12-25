import * as yup from "yup";

const couponSchema = yup.object().shape({
    code: yup
        .string()
        .trim()
        .required('Coupon code is required')
        .min(3, 'Coupon code must be at least 3 characters')
        .max(10, 'Coupon code must be at most 10 characters'),
    type: yup.string().required('Coupon type is required'),
    discountAmount: yup
        .number("Discount must be a number")
        .min(1, 'Discount must be greater than 0')
        .positive('Discount must be a positive number')
        .required('Discount is required'),
    minOrderAmount: yup
        .number("Minimum order amount must be a number")
        .positive('Minimum order amount must be a positive number')
        .required('Minimum order amount is required'),
    maxDiscountAmount: yup
        .number("Maximum discount amount must be a number")
        .positive('Maximum discount amount must be a positive number'),
    startDate: yup.date().required('Start date is required'),
    expirationDate: yup.date().required('Expiration date is required'),
});

const validateCouponData = async (name, value) => {
    try {
        await couponSchema.validateAt(name, { [name]: value });
        return ""; // No error
    } catch (error) {
        return error.message || 'Validation error'; // Fallback message
    }
};

export default validateCouponData;
