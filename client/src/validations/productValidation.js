import * as yup from "yup";

const productValidationSchema = yup.object({
    name: yup.string().trim().required("Product name is required")
        .min(10, "Set a title that describes your product"),
    description: yup.string().trim().required("Description is required")
        .min(10, "Description must be at least 10 characters"),
    category: yup.string().trim().required("Category is required"),
    tags: yup.string().trim(),
});

const validateProduct = async (name, value) => {
    try {
        console.log(name, value);
        await productValidationSchema.validateAt(name, { [name]: value });
        return ""; // No error
    } catch (error) {
        return error.message || "Validation error"; // Fallback message
    }
};

export default validateProduct;