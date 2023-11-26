const request = require('supertest');
const app = require('../../index'); // Import your Express app
const mongoose = require('mongoose');
const User = require('../models/User');

describe('User Controller Tests', () => {
    let createdUserId; // To store the ID of the user created during testing
    let adminAuthToken;
    let regularUserAuthToken;

    afterEach(async () => {
        // Clean up: Delete the test user created during the individual test
        if (createdUserId) {
            await User.deleteOne({ _id: createdUserId });
        }
    });

    // Before running the tests, get the authentication token
    beforeAll(async () => {
        
        // Login to get the authentication token
        const adminLoginResponse = await request(app)
        .post('/auth/login')
        .send({ username: 'sks', password: 'qwer' });
        
        adminAuthToken = adminLoginResponse.body.token;

        const memberLoginResponse = await request(app)
        .post('/auth/login')
        .send({ username: 'sksm', password: 'qwer' });
        
        regularUserAuthToken = memberLoginResponse.body.token;
    });
    
    it('should allow an admin to create a new user', async () => {
        const response = await request(app)
        .post('/users/create')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({ username: 'newadminuser', password: 'newadminpassword', isAdmin: false });
        
        expect(response.statusCode).toBe(201);
        expect(response.body.username).toBe('newadminuser');
        
        // Store the ID of the created user for cleanup
        createdUserId = response.body._id;
    });
    
    it('should prevent a regular user from creating a new user', async () => {
        const response = await request(app)
        .post('/users/create')
        .set('Authorization', `Bearer ${regularUserAuthToken}`)
        .send({ username: 'newregularuser', password: 'newregularpassword', isAdmin: false });
        
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized: Invalid token');
    });
    
    //   it('should create a new user', async () => {
    //     const response = await request(app)
    //       .post('/users/create')
    //       .send({ username: 'testuser', password: 'testpassword', isAdmin: false });
    
    //     expect(response.statusCode).toBe(201);
    //     expect(response.body.username).toBe('testuser');
    
    //     // Store the ID of the created user for cleanup
    //     createdUserId = response.body._id;
    //   });
    
    
    it('should create and edit a new user', async () => {
        // Create a new user
        const createUserResponse = await request(app)
        .post('/users/create')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({ username: 'newadminuser', password: 'newadminpassword', isAdmin: false });
        
        // Retrieve the user ID from the response
        const userId = createUserResponse.body._id; // Assuming your user ID is stored in the _id field
        
        // Edit the user
        const editUserResponse = await request(app)
        .put(`/users/edit/${userId}`)
        .send({ username: 'newusername', password: 'newpassword', isAdmin: true });
        
        createdUserId = userId;
        
        // Assertions for the edit operation
        expect(editUserResponse.statusCode).toBe(200);
        expect(editUserResponse.body.username).toBe('newusername');
    });
    
    it('should list all users', async () => {
        // Create a user to ensure there is at least one user for testing listing
        const createUserResponse = await request(app)
        .post('/users/create')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({ username: 'newadminuser', password: 'newadminpassword', isAdmin: false });
        
        // Store the ID of the created user for cleanup
        createdUserId = createUserResponse.body._id;
        
        // Test the listing functionality
        const response = await request(app).get('/users/list');
        
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });
    
    it('should search for users', async () => {
        // Create a user to ensure there is at least one user for testing search
        const createUserResponse = await request(app)
        .post('/users/create')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({ username: 'searchuser', password: 'searchuser', isAdmin: false });

        // Store the ID of the created user for cleanup
        createdUserId = createUserResponse.body._id;
        
        // Test the search functionality
        const response = await request(app).get('/users/search/searchuser');
        
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });
});
