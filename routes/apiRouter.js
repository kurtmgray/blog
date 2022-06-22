var express = require("express");
var router = express.Router();
const passport = require("passport");
const postcontroller = require("../controllers/postcontroller");
const commentcontroller = require("../controllers/commentcontroller");
const usercontroller = require("../controllers/usercontroller");
const comment = require("../models/comment");

// Index redirect to api
router.get("/", (req, res, next) => {
  res.redirect("/api/posts");
});

// GET all blog posts
router.get("/api/posts", postcontroller.all_posts_get);

// POST create post
router.post(
  "/api/posts/",
  usercontroller.jwt_auth,
  postcontroller.create_post_post
);

// GET a single blog post
router.get("/api/posts/:postId", postcontroller.one_post_get);

// DELETE to delete a post
router.delete(
  "/api/posts/:postId",
  usercontroller.jwt_auth,
  postcontroller.one_post_delete
);

// PATCH to change one element on that post
router.patch(
  "/api/posts/:postId",
  usercontroller.jwt_auth,
  postcontroller.one_post_patch
);

// PUT to update title/text of post
router.put(
  "/api/posts/:postId",
  usercontroller.jwt_auth,
  postcontroller.one_post_put
);

// GET a single post's comments
router.get(
  "/api/posts/:postId/comments",
  commentcontroller.one_post_comments_get
);

// GET a single comment on a single post
router.get(
  "/api/posts/:postId/comments/:commentId",
  commentcontroller.one_post_one_comment_get
);

// POST a comment on a single post
router.post(
  "/api/posts/:postId/comments",
  usercontroller.jwt_auth,
  commentcontroller.create_comment_post
);

// DELETE a comment on a single post
router.delete(
  "/api/posts/:postId/comments/:commentId",
  usercontroller.jwt_auth,
  commentcontroller.one_comment_delete
);

// PATCH to update text of comment
router.patch(
  "/api/posts/:postId/comments/:commentId",
  usercontroller.jwt_auth,
  commentcontroller.one_comment_patch
);

// POST create a user
router.post("/api/users", usercontroller.create_user_post);

// refresh route (verify token, return user)
router.get("/api/users", usercontroller.jwt_auth, usercontroller.users_get);

// GET to read a user
router.get("/api/users/:userId");

// GET route for a user's published and unpublished posts
router.get(
  "/api/users/:userId/posts",
  usercontroller.jwt_auth,
  postcontroller.user_posts_get
);

// POST login
router.post("/api/users/login", usercontroller.login_post);

// for other implementation of OAuth
// router.get("/auth/google", usercontroller.google_auth);

// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   function (req, res) {
//     // Successful authentication, redirect home.
//     console.log("this is request", req);
//     res.redirect("http://localhost:3004/dashboard");
//   }
// );

module.exports = router;
