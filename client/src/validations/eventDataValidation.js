import * as yup from "yup";

const validationSchema = yup.object().shape({
    title: yup.string().trim().required("Title is required")
        .min(2, "Title must be at least 2 characters long")
        .max(20, "Title must be at most 20 characters long"),
    description: yup.string().trim().required("Description is required")
        .min(2, "Description must be at least 20 characters long"),
    eventType: yup.string().trim().required("Event type is required"),
    discountAmount: yup.number()
        .when('eventType', {
            is: (eventType) => eventType === 'Percentage Off',
            then: yup.number()
                .required("Discount amount is required")
                .min(0, "Discount amount must be at least 0")
                .max(100, "Discount amount must be at most 100"),
            else: yup.number()
                .required("Discount amount is required")
                .min(0, "Discount amount must be at least 0")
        }),
    categories: yup.array().of(yup.string().trim().required("Category is required")),
    startDate: yup.date().required("Start date is required"),
    endDate: yup.date().required("End date is required")
        .min(yup.ref('startDate'), "End date must be after start date"),
    couponCode: yup.string().trim().required("Coupon code is required")
        .min(2, "Coupon code must be at least 2 characters long")
        .max(20, "Coupon code must be at most 20 characters long"),
    minPurchaseAmount: yup.number().required("Minimum purchase amount is required")
        .min(0, "Minimum purchase amount must be at least 0"),
    banner: yup.string().trim().required("Banner is required"),
    termsAndConditions: yup.string().trim().required("Terms and conditions is required")
        .min(2, "Terms and conditions must be at least 2 characters long")
        .max(200, "Terms and conditions must be at most 200 characters long"),
    visibility: yup.string().trim().required("Visibility is required"),
});

const validateEventData = async (name, value) => {
    try {
        await validationSchema.validateAt(name, { [name]: value });
        return ""; // No error
    } catch (error) {
        return error.message || "Validation error"; // Fallback message
    }
};

export default validateEventData;