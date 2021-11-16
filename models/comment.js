const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    name: { type: String },
    createDate: { type: Date, default: Date.now },
    content: { type: String },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true }
  }
);

// virtuals

module.exports = mongoose.model('Comment', CommentSchema);