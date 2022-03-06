var express = require('express');
var router = express.Router();
const postcontroller = require('../controllers/postcontroller')
const commentcontroller = require('../controllers/commentcontroller')

// Index redirect to api
router.get('/', (req, res, next) => {
    res.redirect('/api/posts')
})

// GET all blog posts
router.get('/api/posts', postcontroller.all_posts_get);

// GET a single blog post
router.get('/api/posts/:postid', postcontroller.one_post_get)



// GET a single post's comments
router.get('/api/posts/:postid/comments', commentcontroller.one_post_comments_get)

// GET a single comment on a single post (for editing?)
router.get('/api/posts/:postid/comments/:commentid', commentcontroller.one_post_one_comment_get)


module.exports = router;
