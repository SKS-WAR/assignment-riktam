const request = require('supertest');
const app = require('../../index'); // Import your Express app
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

describe('Auth Controller Tests', () => {
  let testUser;

  beforeEach(async () => {
    // Create a test user for authentication testing
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    testUser = await User.create({ username: 'testuserauth', password: hashedPassword, isAdmin: false });
  });

  afterEach(async () => {
    // Remove the test user after each test
    if (testUser) {
      await User.deleteOne({ _id: testUser._id });
    }
  });

  it('should log in with valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'testuserauth', password: 'testpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.token).toBeDefined();
  });

  it('should reject login with invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'testuserauth', password: 'wrongpassword' });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
    expect(response.body.token).toBeUndefined();
  });

  it('should reject login for non-existent user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'nonexistentuser', password: 'testpassword' });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
    expect(response.body.token).toBeUndefined();
  });

  it('should log out successfully', async () => {
    const response = await request(app).post('/auth/logout');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Logout successful');
  });
});
