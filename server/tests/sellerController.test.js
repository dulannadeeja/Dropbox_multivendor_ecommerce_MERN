const request = require('supertest');
const { app, closeServer, startServer } = require('../app');
const User = require('../models/user');
const Shop = require('../models/shop');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const PORT = 8082;

describe('Seller Controller - Signup', () => {
    let createdUserId;
    let createdShopId;
    let token;
    let server;

    beforeAll(async () => {
        // start the server
        server = await startServer(PORT);
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

            // set user as active
            createdUser.isActivated = true;
            await createdUser.save();

        } catch (error) {
            // Fail the test and log the error
            throw error;
        }
    }, 30000);

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

    it('should successfully create a new seller', async () => {
        // Define test data
        const testData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            houseNumber: '123',
            street: 'Main Street',
            zip: '12345',
            country: 'USA',
            state: 'New York',
            city: 'New York',
            phone: '1234567890',
            businessName: 'John Doe Inc.',
            businessCountry: 'USA',
            businessState: 'New York',
            businessCity: 'New York',
            businessZip: '12345',
            businessStreet: 'Main Street',
            businessApartment: '123',
            contactName: 'John Doe',
            contactEmail: 'john.doe@example.com',
            contactPhone: '1234567890'
        };

        // Make a request to the signup endpoint
        const response = await request(app)
            .put('/seller/signup')
            .set('Authorization', `Bearer ${token}`)
            .send(testData)
            .expect(201);

        // Assertions
        expect(response.body).toHaveProperty('message', 'Seller and shop created successfully!');
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('shopId');

        // Optionally, you can perform additional assertions to check the database state
        const createdUser = await User.findById(response.body.userId);
        const createdShop = await Shop.findById(response.body.shopId);

        createdUserId = response.body.userId;
        createdShopId = response.body.shopId;

        // Perform additional assertions as needed
        expect(createdUser).toHaveProperty('firstName', testData.firstName);
        expect(createdShop).toHaveProperty('name', testData.businessName);
    });


    afterAll(async () => {
        // Delete the test user
        if (createdUserId) {
            await User.findByIdAndDelete(createdUserId);
        }

        // Delete the test shop
        if (createdShopId) {
            await Shop.findByIdAndDelete(createdShopId);
        }

        // Close the database connection
        await mongoose.connection.close();

        // Close the server connection
        await closeServer(server);
    });

});
