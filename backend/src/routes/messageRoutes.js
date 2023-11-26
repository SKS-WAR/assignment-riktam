const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const verifyToken = require('../middleware/authMiddleware');

// Secure the routes with authentication
router.post('/send', verifyToken, messageController.sendMessage);
router.post('/like/:messageId', verifyToken, messageController.likeMessage);

module.exports = router;
