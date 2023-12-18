import * as yup from "yup";

const validationSchema = yup.object().shape({
    businessName: yup.string().trim().required("Business name is required"),
    businessCountry: yup.string().trim().required("Country is required"),
    businessState: yup.string().trim().required("State is required"),
    businessCity: yup.string().trim().required("City is required"),
    businessZip: yup.string().trim().required("Zip code is required"),
    businessStreet: yup.string().trim().required("Street is required"),
    businessApartment: yup.string().trim().required("Apartment is required"),
});

const validateBusinessInfo = async (name, value) => {
    try {
        await validationSchema.validateAt(name, { [name]: value });
        return ""; // No error
    } catch (error) {
        return error.message || "Validation error"; // Fallback message
    }
};

export default validateBusinessInfo;
