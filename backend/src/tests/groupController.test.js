const request = require('supertest');
const app = require('../../index'); // Import your Express app
const User = require('../models/User');

describe('Group Controller Tests', () => {
    let authToken; // Store the authentication token
    let testUserId; // Store the test user ID
    let testGroupId; // Store the test group ID
    
    // Before running the tests, create a test user and get the authentication token
    beforeAll(async () => {
        
        // Login to get the authentication token
        const loginResponse = await request(app)
        .post('/auth/login')
        .send({ username: 'sks', password: 'qwer' });
        
        authToken = loginResponse.body.token;

        // Create a test user
        const createUserResponse = await request(app)
        .post('/users/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ username: 'testuser', password: 'testpassword', isAdmin: false });
        
        testUserId = createUserResponse.body._id;
    });
    
    // After each test, delete the created group and the test user
    afterEach(async () => {
        if (testGroupId) {
            // Delete the test group
            await request(app)
            .delete(`/groups/delete/${testGroupId}`)
            .set('Authorization', `Bearer ${authToken}`);
            testGroupId = null
        }
    });
    
    // Your test cases go here...
    
    it('should create a new group', async () => {
        const response = await request(app)
        .post('/groups/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test Group Create' });
        
        testGroupId = response.body._id; // Store the test group ID
        
        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe('Test Group Create');
        expect(response.body.members).toHaveLength(0);
    });
    
    it('should delete an existing group', async () => {
        // Ensure a group is created before attempting to delete
        if (!testGroupId) {
            // Create a new group if not already created
            const createGroupResponse = await request(app)
            .post('/groups/create')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: 'Test Group' });
            
            testGroupId = createGroupResponse.body._id;
        }
        
        // Delete the created group
        const deleteGroupResponse = await request(app)
        .delete(`/groups/delete/${testGroupId}`)
        .set('Authorization', `Bearer ${authToken}`);
        
        expect(deleteGroupResponse.statusCode).toBe(200);
        expect(deleteGroupResponse.body._id).toBe(testGroupId);
    });
    
    it('should search for groups', async () => {
        // Ensure a group is created before attempting to search for groups
        if (!testGroupId) {
          // Create a new group if not already created
          const createGroupResponse = await request(app)
            .post('/groups/create')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: 'Test Group' });
      
          testGroupId = createGroupResponse.body._id;
        }
      
        // Search for groups containing the term 'test'
        const response = await request(app)
          .get('/groups/search/test')
          .set('Authorization', `Bearer ${authToken}`);
      
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
      });
      
    
    it('should add a member to a group', async () => {
        // Ensure a group is created before attempting to add a member
        if (!testGroupId) {
            // Create a new group if not already created
            const createGroupResponse = await request(app)
            .post('/groups/create')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: 'Test Group' });
            
            testGroupId = createGroupResponse.body._id;
        }
        
        // Ensure a user is created before attempting to add a member
        if (!testUserId) {
            // Create a new user if not already created
            const getUserResponse = await request(app).get(`/users/search/sksm`)
            // .send({ username: 'testuser2', password: 'testpassword', isAdmin: false });
            
            testUserId = getUserResponse.body[0]?._id;
        }

        // Add the user as a member to the group
        const response = await request(app)
        .put(`/groups/add-member/${testGroupId}/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.members).toContain(testUserId);
    });
    
    
    
    // After all tests, delete the test user (optional)
    afterAll(async () => {
        // Delete the test user
        await User.findByIdAndDelete(testUserId);
    });
});
