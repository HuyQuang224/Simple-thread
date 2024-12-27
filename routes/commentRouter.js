const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// POST route để tạo bình luận mới
router.post('/comment', commentController.createComment);

module.exports = router;
