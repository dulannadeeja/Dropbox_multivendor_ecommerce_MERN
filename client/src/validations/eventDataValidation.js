import * as yup from "yup";

const validationSchema = yup.object().shape({
    title: yup.string().trim().required("Title is required")
        .min(10, "Title must be at least 10 characters long")
        .max(95, "Title must be at most 95 characters long"),
    description: yup.string().trim().required("Description is required")
        .min(20, "Description must be at least 20 characters long")
        .max(1000, "Description must be at most 1000 characters long"),
    coupon: yup.string().trim().required("Coupon code is required"),
    termsAndConditions: yup.string().trim().required("Terms and conditions is required")
        .min(20, "Terms and conditions must be at least 20 characters long")
        .max(200, "Terms and conditions must be at most 200 characters long"),
    product: yup.string().trim().required("Product is required")
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