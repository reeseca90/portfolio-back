const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    createDate: { type: Date },
    title: { type: String, required: true },
    content: { type: String, required: true },
    published: { type: Boolean },
    thumb: { type: Object },
    image: { type: Object}
  }
);

// virtuals

PostSchema.virtual('createUrl').get(function() {
  return '/api/blog/create/posts/' + this._id;
});

PostSchema.virtual('viewUrl').get(function() {
  return '/api/blog/view/posts/' + this._id;
});

module.exports = mongoose.model('Post', PostSchema);