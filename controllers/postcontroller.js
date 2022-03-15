const { text } = require('express');
const { body, validationResult } = require('express-validator')
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
        .populate('author')
        
        if (!posts) {
            res.status(404).json({ err: 'post not found'})
        }
        res.json({ posts })
    } catch (err) {
        next(err)
    }
}

exports.user_posts_get = async (req, res, next) => {
    try {
        const posts = await Post.find({ author: req.params.userId })

        const published = posts.filter(post => post.published)
        const unpublished = posts.filter(post => !post.published)

        return res.status(200).send({
            success: true,
            posts: {
                published: published,
                unpublished: unpublished
            }
        })

    } catch (err) {
        console.error(err)
        return res.status(401).send({
            success: false,
            error: err
        })
    }
}

exports.create_post_post = [
    
    body('text').trim().isLength({ min: 1 }).withMessage('Text must be specified.'),
    body('title').trim().isLength({ min: 1 }).withMessage('Title must be specified.'),

    (req, res, next) => {
        
        console.log(req.body.author)
        
        const errors = validationResult(req)
        
        if(!errors.isEmpty()) {
            res.json({ "errors": errors })
        }
        else {
            const post = new Post(
                {
                    author: req.body.author,
                    comments: [],
                    published: req.body.published,
                    text: req.body.text,
                    timestamp: new Date,
                    title: req.body.title
                }
            )

            console.log(post)

            post.save(err => {
                console.log(err)
                if (err) { return next(err) }
                res.json({ "post": post })
            })
        }
    }
]