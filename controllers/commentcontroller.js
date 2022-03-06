const Post = require('../models/post')
const Comment = require('../models/comment')


// GET a single post's comments
exports.one_post_comments_get = (req, res, next) => {
    res.json(
        Post.find({ _id: req.body.postid })
        .populate('author')
        .populate('comments')
    )
}

// GET a single comment on a single post (for editing?)
exports.one_post_one_comment_get = (req, res, next) => {
    res.json()
}