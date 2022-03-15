var express = require('express');
var router = express.Router();
const postcontroller = require('../controllers/postcontroller')
const commentcontroller = require('../controllers/commentcontroller')
const usercontroller = require('../controllers/usercontroller');

// Index redirect to api
router.get('/', (req, res, next) => {
    res.redirect('/api/posts')
})

// why not just one call, and populate ALL the info for each post?

// GET all blog posts
router.get('/api/posts', postcontroller.all_posts_get);

// GET a single blog post
router.get('/api/posts/:postid', postcontroller.one_post_get)

// 
// router.get

// POST create post
router.post('/api/posts/', postcontroller.create_post_post)

// GET a single post's comments
router.get('/api/posts/:postid/comments', commentcontroller.one_post_comments_get)

// GET a single comment on a single post (for editing?)
router.get('/api/posts/:postid/comments/:commentid', commentcontroller.one_post_one_comment_get)

// POST create a user
router.post('/api/users', usercontroller.create_user_post)

// refresh route (verify token, return user)
router.get('/api/users', usercontroller.jwt_auth, usercontroller.users_get)


router.get('/api/users/:userId')

// GET route for a user's published and unpublished posts
router.get('/api/users/:userId/posts', postcontroller.user_posts_get)


// POST login
router.post('/api/users/login', usercontroller.login_post) 




module.exports = router;
