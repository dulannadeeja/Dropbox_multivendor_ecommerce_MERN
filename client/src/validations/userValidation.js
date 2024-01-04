import * as yup from "yup";

const validationSchema = yup.object().shape({
    firstName: yup.string().trim().required("First name is required"),
    lastName: yup.string().trim().required("Last name is required"),
    email: yup.string().trim().email("Must be a valid email").required("Email is required"),
    password: yup.string()
        .min(6, 'Password should be at least 6 characters long')
        .matches(/[A-Z]/, 'Password should include at least one uppercase letter')
        .matches(/[a-z]/, 'Password should include at least one lowercase letter')
        .matches(/\d/, 'Password should include at least one number'),
    confirmPassword: yup.string().trim().required("Confirm password is required")
});

const validateUser = async (name, value) => {
    try {
        await validationSchema.validateAt(name, { [name]: value });
        return ""; // No error
    } catch (error) {
        return error.message || "Validation error"; // Fallback message
    }
};

export default validateUser;