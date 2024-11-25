const User = require("../models/user");

const { body, validationResult } = require("express-validator");
const { hashSync, compare } = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.create_user_post = [
  // body("fname")
  //   .trim()
  //   .isLength({ min: 1 })
  //   .escape()
  //   .withMessage("First name must be specified.")
  //   .isAlphanumeric()
  //   .withMessage("First name has non-alphanumeric characters."),
  // body("lname")
  //   .trim()
  //   .isLength({ min: 1 })
  //   .escape()
  //   .withMessage("Last name must be specified.")
  //   .isAlphanumeric()
  //   .withMessage("Last name has non-alphanumeric characters."),
  body("fname")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces."),
  body("lname")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Last name must be specified.")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces."),
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Username must be specified.")
    .isAlphanumeric()
    .withMessage("Username has non-alphanumeric characters."),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage("Password must be at least 6 characters."),

  (req, res, next) => {
    // console.log("reqbody", req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({ 
        success: false,
        errors: errors 
      });
    } else {
      const user = new User({
        username: req.body.username,
        password: hashSync(req.body.password, 10),
        fname: req.body.fname,
        lname: req.body.lname,
        admin: false,
        canPublish: false,
        posts: [],
        comments: [],
      });
      user
        .save()
        .then((user) => {
          res.json({
            success: true,
            message: "User created successfully",
            user: {
              id: user._id,
              username: user.username,
              canPublish: user.canPublish,
              admin: user.admin,
            },
          });
        })
        .catch((err) => {
          if (err) {
            res.json({
              success: false,
              message: "Something went wrong",
              error: err,
            });
          }
        });
    }
  },
];

exports.login_post = async (req, res, next) => {
  let user;

  // if googleId, post call came from google OAuth
  if (req.body.googleId) {
    user = await User.findOne({ googleId: req.body.googleId }).populate(
      "posts"
    );
    if (!user) {
      const newUser = {
        googleId: req.body.profile.sub,
        username: req.body.profile.name,
        password: null,
        fname: req.body.profile.given_name,
        lname: req.body.profile.family_name,
        admin: false,
        canPublish: false,
        posts: [],
        comments: [],
      };
      user = await User.create(newUser);
      // console.log(user);
    }
  } else {
    // else POST req came from non-oauth, look up by
    user = await User.findOne({ username: req.body.username }).populate(
      "posts"
    );
    const password = req.body.password;
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User does not exist",
        field: "username",
      });
    }

    const pwdVerify = await compare(password, user.password);
    if (!pwdVerify) {
      return res.status(401).send({
        success: false,
        message: "Password does not match",
        field: "password",
      });
    }
  }
  const payload = {
    id: user._id,
    username: user.username,
    admin: user.admin,
    canPublish: user.canPublish,
    posts: user.posts,
  };
  const token = jwt.sign(payload, "random string that should be secret", {
    expiresIn: "1d",
  });

  return res.status(200).send({
    success: true,
    message: "Logged in successfully",
    token: token,
    // this becomes currentUser
    user: {
      id: user._id,
      username: user.username,
      admin: user.admin,
      canPublish: user.canPublish,
      posts: user.posts,
    },
  });
};

exports.users_get = async (req, res, next) => {
  return res.status(200).send({
    success: true,
    user: {
      username: req.user.username,
      id: req.user._id,
      canPublish: req.user.canPublish,
      admin: req.user.admin,
      posts: req.user.posts,
    },
  });
};

exports.jwt_auth = passport.authenticate("jwt", { session: false });
exports.google_auth = passport.authenticate("google", {
  scope: ["email", "profile"],
});
