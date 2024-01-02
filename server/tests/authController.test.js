const request = require('supertest');
const { app, closeServer, startServer } = require('../app');
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const PORT = 8081;

describe('Auth Controller', () => {
    let createdUserId;
    let token;
    let server;

    beforeAll(async () => {
        // start the server
        server = await startServer();
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

            // Check if the user was created in the DB
            const createdUser = await User.findById(response.body.userId);
            expect(createdUser).toHaveProperty('firstName', userData.firstName);
            expect(createdUser).toHaveProperty('lastName', userData.lastName);
            expect(createdUser).toHaveProperty('email', userData.email);
            expect(createdUser).toHaveProperty('password');

            // Check if the password was hashed
            expect(createdUser.password).not.toEqual(userData.password);

            // Check if the password was hashed correctly
            const isPasswordValid = await bcrypt.compare(userData.password, createdUser.password);

            expect(isPasswordValid).toBe(true);

        } catch (error) {
            // Fail the test and log the error
            throw error;
        }
    });

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

    it('should send a verification email', async () => {
        try {
            const userData = {
                id: createdUserId,
                role: 'user',
            };

            const response = await request(app)
                .post('/auth/verification')
                .send(userData)
                .expect(200);

            // Assertions
            expect(response.body).toHaveProperty('message', 'Verification email sent.');

            // set the user to verified
            const user = await User.findById(createdUserId);
            user.isActivated = true;
            await user.save();
        } catch (error) {
            // Fail the test and log the error
            throw error;
        }
    });



    it('should successfully login a user', async () => {
        try {
            const userData = {
                email: 'john.doe@example.com',
                password: 'testpassword',
            };

            const response = await request(app)
                .post('/auth/login')
                .send(userData)
                .expect(200);

            token = response.body.user.token;

            // Assertions
            expect(response.body).toHaveProperty('message', 'Login successful.');
        } catch (error) {
            // Fail the test and log the error
            throw error;
        }
    }
    );

    it('should fail login with incorrect password', async () => {
        try {
            const userData = {
                email: 'john.doe@example.com',
                password: 'wrongpassword',
            };

            const response = await request(app)
                .post('/auth/login')
                .send(userData)
                .expect(401);

            // Assertions
            expect(response.body).toHaveProperty('message', 'There was a problem logging in. Check your email and password or create an account.');
        } catch (error) {
            // Fail the test and log the error
            throw error;
        }
    }
    );

    it('should fail login with incorrect email', async () => {
        try {
            const userData = {
                email: 'incorrect@email.com',
                password: 'testpassword',
            };

            const response = await request(app)
                .post('/auth/login')
                .send(userData)
                .expect(401);

            // Assertions
            expect(response.body).toHaveProperty('message', 'There was a problem logging in. Check your email and password or create an account.');
        } catch (error) {
            // Fail the test and log the error
            throw error;
        }
    }
    );

    it('should successfully send a password reset email', async () => {
        try {
            const userData = {
                email: 'john.doe@example.com',
            };

            const response = await request(app)
                .post('/auth/password-reset')
                .send(userData)
                .expect(200);

            // Assertions
            expect(response.body).toHaveProperty('message', 'Password reset email sent.');

        } catch (error) {
            // Fail the test and log the error
            throw error;
        }
    });

    it('should successfully reset a password', async () => {
        try {
            const userData = {
                token: token,
                password: 'bbC@News$2021',
                confirmPassword: 'bbC@News$2021',
            };

            const response = await request(app)
                .post('/auth/set-password')
                .send(userData)
                .expect(200);

            // Assertions
            expect(response.body).toHaveProperty('message', 'Password reset successful.');

        } catch (error) {
            // Fail the test and log the error
            throw error;
        }
    }
    );

    it('should successfully login with new password', async () => {
        try {
            const userData = {
                email: 'john.doe@example.com',
                password: 'bbC@News$2021',
            };

            const response = await request(app)
                .post('/auth/login')
                .send(userData)
                .expect(200);

            token = response.body.user.token;

            // Assertions
            expect(response.body).toHaveProperty('message', 'Login successful.');

        } catch (error) {
            // Fail the test and log the error
            throw error;
        }
    }
    );

    it('should successfully load a user', async () => {
        try {
            const response = await request(app)
                .get('/auth/load-user')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            // Assertions
            expect(response.body).toHaveProperty('message', 'User loaded.');


        }
        catch (error) {
            // Fail the test and log the error
            throw error;
        }

    });

    it('should successfully logout a user', async () => {
        try {
            const response = await request(app)
                .get('/auth/logout')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            // Assertions
            expect(response.body).toHaveProperty('message', 'Logout successful.');

        }
        catch (error) {
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
        await closeServer(server);
    });
});
