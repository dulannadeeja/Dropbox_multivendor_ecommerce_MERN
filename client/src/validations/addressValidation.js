import * as yup from "yup";

const validationSchema = yup.object().shape({
    houseNumber: yup.string().trim().required("House number is required"),
    street: yup.string().trim().required("Street is required"),
    country: yup.string().trim().required("Country is required"),
    state: yup.string().trim().required("State is required"),
    city: yup.string().trim().required("City is required"),
    zip: yup.string().trim().required("Zip code is required"),
    addressNickname: yup.string().trim(),
});

const validateAddress = async (name, value) => {
    try {
        await validationSchema.validateAt(name, { [name]: value });
        return ""; // No error
    } catch (error) {
        return error.message || "Validation error"; // Fallback message
    }
};

export default validateAddress;