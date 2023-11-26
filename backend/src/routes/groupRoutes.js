const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/create',verifyToken, groupController.createGroup);
router.delete('/delete/:groupId',verifyToken, groupController.deleteGroup);
router.get('/search/:groupName',verifyToken, groupController.searchGroup);
router.put('/add-member/:groupId/:userId',verifyToken, groupController.addMember);

module.exports = router;