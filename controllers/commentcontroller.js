const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator");

exports.one_post_comments_get = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate(
      "author"
    );
    if (!comments) {
      res.status(404).send({
        error: `no comments found for post ${req.params.postId}`,
      });
    }
    res.status(200).send({
      success: true,
      comments: comments,
    });
  } catch (err) {
    res.status(401).send({
      success: false,
      message: err,
    });
  }
};

exports.one_post_one_comment_get = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId).populate(
      "author"
    );

    if (!comment) {
      res
        .status(404)
        .json({ err: `no comment with id ${req.params.commentId} found ` });
    }
    res.status(200).send({
      success: true,
      comment: comment,
    });
  } catch (err) {
    res.status(401).send({
      success: false,
      message: err,
    });
  }
};

exports.create_comment_post = [
  body("text")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Comment must be entered."),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send({ errors: errors });
    } else {
      const comment = new Comment({
        author: req.body.author,
        text: req.body.text,
        timestamp: new Date(),
        post: req.body.post,
      });

      console.log(comment);
      comment.save((err) => {
        console.log(err);
        if (err) {
          return next(err);
        }
        res.status(200).send({
          success: true,
          comment: comment,
        });
      });
    }
  },
];

exports.one_comment_delete = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    console.log(comment);
    res.status(200).send({
      success: true,
      message: "Comment deleted.",
      id: comment._id,
    });
  } catch (err) {
    res.status(404).send({
      success: false,
      message: "ID not found:",
      err,
    });
  }
};

exports.one_comment_patch = async (req, res) => {
  console.log(req.body);
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.commentId, {
      text: req.body.text,
    });

    if (comment) {
      try {
        const updatedComment = await Comment.findById(
          req.params.commentId
        ).populate("author");
        console.log("UC", updatedComment);
        if (!updatedComment) {
          res.status(404).send({
            success: false,
            message: "no comment found",
          });
        }
        res.status(200).send({
          success: true,
          updatedComment,
        });
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    res.status(404).send({
      success: false,
      error: err,
    });
  }
};
