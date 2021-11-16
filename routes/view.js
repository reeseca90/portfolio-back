var express = require('express');
var router = express.Router();

const viewController = require('../controllers/viewController');

// view all posts
router.get('/posts', viewController.view_all);

// view one post and comments
router.get('/posts/:id', viewController.view_one);

// reader post a comment
router.post('/posts/:id', viewController.comment);

module.exports = router;