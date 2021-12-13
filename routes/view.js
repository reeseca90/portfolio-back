var express = require('express');
var router = express.Router();

const viewController = require('../controllers/viewController');

const Post = require('../models/post');

const redis = require('redis');
const client = redis.createClient(6379);
client.on('error', err => {
  console.log('Error' + err)
});

// caching function with redis for view all posts
async function allPostsCache(req, res, next) { 
  console.log('caching')
  await client.connect();

  const cachePosts = await client.get('posts');
  
  if (cachePosts) {
    await client.quit();
    const postCount = await Post.countDocuments({});
    res.send({ title: 'All Posts Cached', count: postCount, posts: JSON.parse(cachePosts) });
  } else {
    await client.quit();
    next();
  }
}

// view all posts
router.get('/posts', allPostsCache, viewController.view_all);

// view one post and comments
router.get('/posts/:id', viewController.view_one);

// reader post a comment
router.post('/posts/:id', viewController.comment);

module.exports = router;