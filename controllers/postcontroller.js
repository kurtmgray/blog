const { body, validationResult } = require('express-validator')
const Post = require('../models/post')

// GET all blog posts
exports.all_posts_get = async (req, res, next) => {
    try {
        const posts = await Post.find({}).populate('author')
        if (!posts) {
            res.status(404).send({ 
                err: 'no posts found'
            })
        }
        res.status(200).send({ 
            posts 
        });
    } catch (err) {
        next(err)
    }
}

// GET a single blog post
exports.one_post_get = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId)
        .populate('author')
        
        if (!post) {
            res.status(404).send({ 
                err: 'post not found'
            })
        }
        res.status(200).send({ 
            post 
        })
    } catch (err) {
        next(err)
    }
}

exports.one_post_delete = async (req, res, next) => {
    try{
        
        const post = await Post.findByIdAndDelete(req.params.postId)
        console.log(await post)
        
        // new - is this ok, so should I call a separate fetch fron the frontend?
        // seems that either way I would be repeating code?
        if (await post) { 
            try{
                const posts = await Post.find({}).populate('author')
                if (!posts) {
                    res.status(404).send({ 
                        success: false,
                        message: 'no posts found'})
                }
                res.status(200).send({ 
                    success: true,
                    posts 
                });
            } catch (err) {
                next(err)
            }
        }
    } catch (err) {
        res.status(404).send({
            success: false,
            message: 'ID not found'
        })
    }
}

exports.one_post_patch = async (req, res, next) => {
    try{
        const post = await Post.findByIdAndUpdate(req.params.postId, {
            published: req.body.published
        })
        // some of these Mongoose methods have callbacks that return an 
        // error (if any) and the post (prior to update) do i need that callback? just for the error, maybe?
        if (await post) { 
            try{
                const posts = await Post.find({}).populate('author')
                if (!posts) {
                    res.status(404).send({ 
                        success: false,
                        message: 'no posts found'})
                }
                res.status(200).send({ 
                    success: true,
                    posts 
                });
            } catch (err) {
                next(err)
            }
        }

    } catch (err) {
        next(err)
    }
}

exports.one_post_put = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {
            _id: req.body._id,
            author: req.body.author,
            title: req.body.title,
            text: req.body.text,
            published: req.body.published,
            timestamp: req.body.timestamp
        })
        return res.status(200).send({
            success: true,
            message: 'Post updated'
        })
    } catch (err) {
        // what am i doing here? next? return the error as response? both?
        next(err)
        return res.status(401).send({
            success: false,
            error: err
        })
    }
}


exports.user_posts_get = async (req, res, next) => {
    try {
        const posts = await Post.find({ author: req.params.userId })

        // better to filter on backend or frontend?
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
        next(err)
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