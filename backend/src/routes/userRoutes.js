const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware')
router.post('/create',authenticateToken, userController.createUser);
router.put('/edit/:userId', userController.editUser);
router.get('/list', userController.listUsers);
router.get('/search/:username', userController.searchUsers);
router.get('/:userId', userController.getUserById);

module.exports = router;
