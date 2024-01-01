const request = require('supertest');
const { app, closeServer } = require('../app');
const User = require('../models/user');
const mongoose = require('mongoose');

describe('Auth Controller', () => {
    let createdUserId;

    beforeAll(async () => {
        // close the server connection if already open
        closeServer();
    });

    it('should successfully create a new user', async () => {
        try {
            // Check if the user already exists and delete if found
            const existingUser = await User.findOne({ email: 'john.doe@example.com' });
            if (existingUser) {
                await User.findByIdAndDelete(existingUser._id);
            }

            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'testpassword',
                confirmPassword: 'testpassword',
            };

            const response = await request(app)
                .put('/auth/signup')
                .field('firstName', userData.firstName)
                .field('lastName', userData.lastName)
                .field('email', userData.email)
                .field('password', userData.password)
                .field('confirmPassword', userData.confirmPassword)
                .expect(201);

            // Assertions
            expect(response.body).toHaveProperty('message', 'User created successfully!');
            expect(response.body).toHaveProperty('userId');

            // Store the created user ID for cleanup
            createdUserId = response.body.userId;
        } catch (error) {
            // Fail the test and log the error
            throw error;
        }
    }, 30000);

    it('should handle duplicate email during signup', async () => {
        try {
            // Use the same email as in the previous test
            const userData = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'testpassword',
                confirmPassword: 'testpassword',
            };

            const response = await request(app)
                .put('/auth/signup')
                .field('firstName', userData.firstName)
                .field('lastName', userData.lastName)
                .field('email', userData.email)
                .field('password', userData.password)
                .field('confirmPassword', userData.confirmPassword)
                .expect(422);

            // Assertions for duplicate email error
            expect(response.body).toHaveProperty('message', 'Email address already exists!');
        } catch (error) {
            // Fail the test and log the error
            throw error;
        }
    });

    afterAll(async () => {
        // Cleanup: Delete the user created during the test
        if (createdUserId) {
            await User.findByIdAndDelete(createdUserId);
        }

        // Close the DB connection
        await mongoose.connection.close();

        // Close the server connection
        closeServer();
    });
});
