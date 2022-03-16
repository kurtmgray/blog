const Post = require('../models/post')
const Comment = require('../models/comment')
const User = require('../models/user')

// GET a single post's comments
exports.one_post_comments_get = async (req, res, next) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
        if(!comments) {
            res.status(404).json({ err: `no comments found for post ${req.params.postId}`})
        }
        res.json({ comments })
    } catch (err) {
        next(err)
    }
}

// GET a single comment on a single post (for editing?)
exports.one_post_one_comment_get = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId).populate('author')
        
        if(!comment) {
            res.status(404).json({ err: `no comment with id ${req.params.commentId} found `})
        }
        res.json({ comment })
    } catch (err) {
        next(err)
    }
}