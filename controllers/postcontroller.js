const Post = require('../models/post')

// GET all blog posts
exports.all_posts_get = async (req, res, next) => {
    try {
        const posts = await Post.find({})
        if (!posts) {
            res.status(404).json({ err: 'no posts found'})
        }
        res.json({ posts });
    } catch (err) {
        next(err)
    }
}

// GET a single blog post
exports.one_post_get = async (req, res, next) => {
    try {
        const posts = await Post.findById(req.params.postid)
        //.populate('author')
        
        if (!posts) {
            res.status(404).json({ err: 'post not found'})
        }
        res.json({ posts })
    } catch (err) {
        next(err)
    }
}

