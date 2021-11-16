var express = require('express');
var router = express.Router();

const createController = require('../controllers/createController');

// view all posts
router.get('/posts', createController.view_all);

// GET create new post form
router.get('/posts/new', createController.newpost);

// POST create new post form
router.post('/posts/new', createController.newpost_submit);

// GET one post and comments
router.get('/posts/:id', createController.view_one);

// add comment or delete a comment
router.post('/posts/:id', createController.commentAction);

// GET edit post form
router.get('/posts/:id/edit', createController.view_one_edit);

// POST edit post form
router.post('/posts/:id/edit', createController.editAction);


module.exports = router;