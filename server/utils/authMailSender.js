const nodemailer = require('nodemailer');

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Function to send verification email
const sendVerificationEmail = async (recipientName, recipientEmail, verificationUrl) => {
    const mailOptions = {
        from: {
            name: process.env.APP_NAME,
            address: process.env.EMAIL_USER
        },
        to: recipientEmail,
        subject: 'Account Verification',
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center;">
                <img src="COMPANY_LOGO_URL" alt="Company Logo" style="width: 100px; height: 100px; margin-bottom: 20px;">
                <h2 style="color: #3498db; margin-bottom: 10px;">Welcome to ${process.env.APP_NAME}!</h2>
                <p>Hello ${recipientName},</p>
                <p>Please verify your account by clicking the link below:</p>
                <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Verify My Account</a>
                <p style="margin-top: 20px;">This link will expire in 1 hour.</p>
                <p style="margin-top: 10px; color: #888;">If you did not request this, please ignore this email.</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

// Function to send password reset email
const sendPasswordResetEmail = async (recipientEmail, resetUrl) => {
    const mailOptions = {
        from: {
            name: process.env.APP_NAME,
            address: process.env.EMAIL_USER
        },
        to: recipientEmail,
        subject: 'Password Reset',
        text: `Please reset your password by clicking this link: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
};
