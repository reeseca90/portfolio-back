// controllers for viewing posts as a visitor
const Comment = require('../models/comment');
const Post = require('../models/post');
const { body, validationResult } = require('express-validator');
const async = require('async');

const redis = require('redis');
const client = redis.createClient(6379);
client.on('error', err => {
  console.log('Error' + err)
});

exports.view_all = async function(req, res, next) {
  // provided from the frontend as a query parameter
  const pageNum = req.query.pageNum;
  const postCount = await Post.countDocuments({});
  
  Post.find({})
  .sort({createDate: -1})
  .skip((pageNum - 1) * 5) // skip records for pagination
  .limit(5) // limit to five posts per page
  .exec(async function(err, posts) {
    if (err) { return next(err); }
      // open client and cache data for use in route
      await client.connect();
      client.setEx("posts", 300, JSON.stringify(posts));
      client.quit();
      res.send({ title: 'All Posts', count: postCount, posts: posts });
    });
}

exports.view_one = function(req, res, next) {

  async.parallel({

    post: function(callback) {
      Post.findById(req.params.id)
      .exec(callback)
    },
    comment: function(callback) {
      Comment.find({'post': req.params.id})
      .sort({createDate: -1})
      .exec(callback)
    },
  }, function(err, results) {
    if (err) { return next(err); }
    if (results.post==null) {
      const err = new Error('Post not found');
      err.status = 404;
      return next(err);
    }
    res.send({ title: 'Post', post: results.post, comments: results.comment });
  }
  );

}

// reader comment on a post
exports.comment = [
  body('name', 'Must provide a name').trim().isLength({min:1}).escape(),
  body('content', 'Cannot make a blank comment!').trim().isLength({min:1}).escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    const post = await Post.findById(req.params.id);

    const comment = new Comment(
      {
        name: req.body.name,
        content: req.body.content,
        post: post._id
    });

    if (!errors.isEmpty()) {
      res.send({ title: 'Submit Failed', errors: errors.array() })
    }
    else {
      comment.save(function(err) {
        if (err) { return next(err); }
        res.end();
      })
    }
  }
];