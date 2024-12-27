const express = require('express');
const router = express.Router();
const controller = require('../controllers/threadController');
const models = require('../models');

router.get('/', controller.show);
router.get('/thread/:id', controller.showDetail);
router.post('/', controller.createThread);
router.get('/home', controller.showHome);

module.exports = router;
