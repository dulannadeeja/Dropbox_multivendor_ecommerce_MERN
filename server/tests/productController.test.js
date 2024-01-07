const request = require('supertest');
const { app, closeServer, startServer } = require('../app');
const User = require('../models/user');
const Shop = require('../models/shop');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Product = require('../models/product');

describe('Product Controller', () => {
    let createdUserId;
    let createdShopId;
    let createdProductId;
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

            // set user as active
            createdUser.isActivated = true;
            await createdUser.save();

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
    });

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
            contactPhone: '1234567890',
            shopAvatar: '',
            shopBanner: '',
            shopDescription: 'This is a test shop',
        };

        // Make a request to the signup endpoint
        const response = await request(app)
            .post('/seller/signup') // Make sure the route and method match your implementation
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

        // Perform additional assertions as needed
        expect(createdUser).toHaveProperty('firstName', testData.firstName);
        expect(createdShop).toHaveProperty('name', testData.businessName);
    });

    it('should successfully create a new product', async () => {

        const images = [
            './product-page-02-secondary-product-shot.jpg'
        ]

        // Define test data
        const testData = {
            name: 'Test Product',
            description: 'This is a test product',
            category: 'Test Category',
            originalPrice: 100,
            discountPrice: 90,
            stock: 10,
            tags: 'test',
            images: images,
        };

        console.log('testData', testData);

        try {
            // Make a request to the signup endpoint
            const response = await request(app)
                .put('/product/create')
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'multipart/form-data')
                .field('name', testData.name)
                .field('description', testData.description)
                .field('category', testData.category)
                .field('originalPrice', testData.originalPrice)
                .field('discountPrice', testData.discountPrice)
                .field('stock', testData.stock)
                .field('tags', testData.tags)
                .expect(201);

            // Assertions
            expect(response.body).toHaveProperty('message', 'Product created successfully.');
            expect(response.body).toHaveProperty('product');

            // check the product
            const createdProduct = await Product.findById(response.body.product._id);

            createdProductId = response.body.product._id;

            // Perform additional assertions
            expect(createdProduct).toHaveProperty('name', testData.name);
            expect(createdProduct).toHaveProperty('description', testData.description);
            expect(createdProduct).toHaveProperty('category', testData.category);
            expect(createdProduct).toHaveProperty('originalPrice', testData.originalPrice);
            expect(createdProduct).toHaveProperty('discountPrice', testData.discountPrice);
            expect(createdProduct).toHaveProperty('stock', testData.stock);
            expect(createdProduct).toHaveProperty('tags', testData.tags);
        }
        catch (error) {
            // Fail the test and log the error
            throw error;
        }
    });



    it('should get all products', async () => {
        try {
            // Make a request to the signup endpoint
            const response = await request(app)
                .get(`/product/all`)
                .expect(200);

            // Assertions
            expect(response.body).toHaveProperty('message', 'Products fetched successfully.');
            expect(response.body).toHaveProperty('products');
        }
        catch (error) {
            // Fail the test and log the error
            throw error;
        }
    });

    it('should create a review', async () => {
        try {
            // Define test data
            const testData = {
                productId: createdProductId,
                rating: 5,
                comment: 'This is a test review',
            };

            // Make a request to the signup endpoint
            const response = await request(app)
                .post(`/product/review`)
                .set('Authorization', `Bearer ${token}`)
                .send(testData)
                .expect(201);

            // Assertions
            expect(response.body).toHaveProperty('message', 'Review added successfully.');
            expect(response.body).toHaveProperty('product');
        }
        catch (error) {
            // Fail the test and log the error
            throw error;
        }
    });

    it('should update a existing review', async () => {
        try {
            // Define test data
            const testData = {
                productId: createdProductId,
                rating: 5,
                comment: 'This is a test review',
            };

            // Make a request to the signup endpoint
            const response = await request(app)
                .post(`/product/review`)
                .set('Authorization', `Bearer ${token}`)
                .send(testData)
                .expect(201);

            // Assertions
            expect(response.body).toHaveProperty('message', 'Review updated successfully.');
            expect(response.body).toHaveProperty('product');
        }
        catch (error) {
            // Fail the test and log the error
            throw error;
        }
    });


    it('should get a product by id', async () => {
        try {
            // Make a request
            const response = await request(app)
                .get(`/product/${createdProductId}`)
                .expect(200);

            // Assertions
            expect(response.body).toHaveProperty('message', 'Product fetched successfully.');
            expect(response.body).toHaveProperty('product');
        }
        catch (error) {
            // Fail the test and log the error
            throw error;
        }
    });

    it('should get featured products', async () => {
        try {
            // Make a request to the signup endpoint
            const response = await request(app)
                .get(`/product/featured`)
                .expect(200);

            // Assertions
            expect(response.body).toHaveProperty('message', 'Featured products fetched successfully.');
            expect(response.body).toHaveProperty('products');
        }
        catch (error) {
            // Fail the test and log the error
            throw error;
        }
    });

    it('should get suggested products', async () => {
        try {
            // Make a request to the signup endpoint
            const response = await request(app)
                .get(`/product/suggestions/${createdProductId}`)
                .expect(200);

            // Assertions
            expect(response.body).toHaveProperty('message', 'Suggested products fetched successfully.');
            expect(response.body).toHaveProperty('products');
        }
        catch (error) {
            // Fail the test and log the error
            throw error;
        }
    });

    it('should get best selling products', async () => {
        try {
            // Make a request to the signup endpoint
            const response = await request(app)
                .get(`/product/best-selling`)
                .expect(200);

            // Assertions
            expect(response.body).toHaveProperty('message', 'Best selling products fetched successfully.');
            expect(response.body).toHaveProperty('products');
        }
        catch (error) {
            // Fail the test and log the error
            throw error;
        }
    });

    it('should successfully delete a product', async () => {
        try {
            // Make a request to the signup endpoint
            const response = await request(app)
                .delete(`/product/delete/${createdProductId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            // Assertions
            expect(response.body).toHaveProperty('message', 'Product deleted successfully.');

            // check the product
            const createdProduct = await Product.findById(createdProductId);

            // Perform additional assertions
            expect(createdProduct).toBeNull();
        }
        catch (error) {
            // Fail the test and log the error
            throw error;
        }
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
