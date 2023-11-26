const request = require('supertest');
const app = require('../../index'); // Import your Express app
const User = require('../models/User');
const Group = require('../models/Group');
const Message = require('../models/Message');

describe('Message Controller Tests', () => {
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

  // Before running the message tests, create a test group
  beforeAll(async () => {
    // Create a test group
    const createGroupResponse = await request(app)
      .post('/groups/create')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test Group' });

    testGroupId = createGroupResponse.body._id;
  });

  it('should send a message to a group', async () => {
    const response = await request(app)
      .post('/messages/send')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ content: 'Test Message', senderId: testUserId, groupId: testGroupId });

    expect(response.statusCode).toBe(201);
    expect(response.body.content).toBe('Test Message');
    expect(response.body.sender).toBe(testUserId);
    expect(response.body.group).toBe(testGroupId);
  });

  it('should like a message', async () => {
    // Create a test message
    console.log(({ content: 'Test Message', senderId: testUserId, groupId: testGroupId }))
    const sendMessageResponse = await request(app)
      .post('/messages/send')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ content: 'Test Message', senderId: testUserId, groupId: testGroupId });

    const messageId = sendMessageResponse.body._id;

    // Like the test message
    const response = await request(app)
      .post(`/messages/like/${messageId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ userId: testUserId });

    expect(response.statusCode).toBe(200);
    expect(response.body.likes).toContain(testUserId);
  });

  // After all tests, you may want to delete the test user and group (optional)
  afterAll(async () => {
    // Delete the test user
    await User.findByIdAndDelete(testUserId);

    // Delete the test group
    await Group.findByIdAndDelete(testGroupId);
  });
});
