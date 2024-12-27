const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

// Định nghĩa route để toggle like
router.post('/toggle-like', likeController.toggleLike);

module.exports = router;
