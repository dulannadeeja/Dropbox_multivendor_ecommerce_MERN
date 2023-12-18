// validations/contactInfoValidation.js
import * as yup from 'yup';

const contactInfoSchema = yup.object().shape({
    contactName: yup.string().trim().required("Contact name is required")
        .min(2, "Contact name must be at least 2 characters long")
        .max(20, "Contact name must be at most 20 characters long"),
    contactEmail: yup.string().trim().email("Invalid email address")
        .required("Email is required"),
    contactPhone: yup.string().trim().required("Phone number is required")
        .matches(/^\d{10}$/, "Phone number must be 10 digits long")
        .matches(/^[0-9]*$/, "Phone number must contain only digits")
});

const validateContactInfo = async (name, value) => {
    try {
        await contactInfoSchema.validateAt(name, { [name]: value });
        return ""; // No error
    } catch (error) {
        return error.message || "Validation error"; // Fallback message
    }
};

export default validateContactInfo;
