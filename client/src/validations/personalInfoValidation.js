import * as yup from "yup";

const validationSchema = yup.object().shape({
    firstName: yup.string().trim().required("First name is required")
        .min(2, "First name must be at least 2 characters long")
        .max(20, "First name must be at most 20 characters long"),
    lastName: yup.string().trim().required("Last name is required")
        .min(2, "Last name must be at least 2 characters long"),
    email: yup.string().trim().email("Invalid email address")
        .required("Email is required"),
    houseNumber: yup.string().trim().required("House number is required"),
    street: yup.string().trim().required("Street is required"),
    zip: yup.string().trim().required("Zip code is required"),
    country: yup.string().trim().required("Country is required"),
    state: yup.string().trim().required("State is required"),
    city: yup.string().trim().required("City is required"),
    phone: yup.string().trim().required("Phone number is required")
});

const validatePersonalInfo = async (name, value) => {
    try {
        await validationSchema.validateAt(name, { [name]: value });
        return ""; // No error
    } catch (error) {
        return error.message || "Validation error"; // Fallback message
    }
};

export default validatePersonalInfo;