// validations/contactInfoValidation.js
import * as yup from 'yup';

const contactInfoSchema = yup.object().shape({
    email: yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: yup.string().matches(/^[0-9]{10}$/, 'Invalid phone number').required('Phone number is required'),
    address: yup.string().trim().required('Address is required'),
});

const validateContactInfo = async (contactInfo) => {
    try {
        await contactInfoSchema.validate(contactInfo, { abortEarly: false });
        return {};
    } catch (error) {
        const errors = {};
        error.inner.forEach((e) => {
            errors[e.path] = e.message;
        });
        return errors;
    }
};

export default validateContactInfo;
