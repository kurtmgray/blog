const User = require('../models/user')
const { body, validationResult } = require('express-validator')
const { hashSync, compare } = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken')

exports.create_user_post = [

  body('fname').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
    .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
  body('lname').trim().isLength({ min: 1 }).escape().withMessage('Last name must be specified.')
    .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
  body('username').trim().isLength({ min: 1 }).escape().withMessage('Username must be specified.')
    .isAlphanumeric().withMessage('Username has non-alphanumeric characters.'),
  body('password').trim().isLength({ min: 6 }).escape().withMessage('Password must be at least 6 characters.'),

  (req, res, next) => {
      console.log('reqbody', req)
  
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) { 
      res.json({ errors: errors })
    }
    else {  
      const user = new User(
          {
              username: req.body.username,
              password: hashSync(req.body.password, 10),
              fname: req.body.fname,
              lname: req.body.lname,
              admin: false,
              posts: [],
              comments: []
          }
      )
      user.save()
      .then(user => {
          res.json({
              success: true,
              message: "User created successfully",
              user: {
                  id: user._id,
                  username: user.username,
                  admin: user.admin
              }
          })
      })
      .catch(err => {
          if (err) {
            res.json({
              success: false,
              message: "Something went wrong",
              error: err
            })
          }
      })
    } 
  }   
] 

exports.log_in_post = async (req, res, next) => {
    const user = await User.findOne({ username: req.body.username })
    const password = req.body.password
    
    if (!user) {
        return res.status(401).send({ 
            success: false,
            message: 'User does not exist' 
        })
    }
    
    const pwdVerify = await compare(password, user.password)
    if(!pwdVerify) {
        return res.status(401).send({ 
            success: false,
            message: 'Password does not match' 
        })
    }

    const payload = {
        id: user._id,
        username: user.username,
        admin: user.admin
    } 
    const token = jwt.sign(payload, 'random string that should be secret', { expiresIn: '1d' })

    return res.status(200).send({ 
        success: true,
        message: 'Logged in successfully',
        token: 'Bearer ' + token,
        // this becomes currentUser
        user: {
            id: user._id,
            username: user.username,
            posts: user.posts
        }
    })
    
}

exports.jwt_auth = passport.authenticate('jwt', {session: false})

exports.protected = (req, res) => {
    
    return res.status(200).send({
        success: true,
        user: {
            id: req.user._id,
            username: req.user.username,
        }
    })
}

exports.refresh_get = async (req, res, next) => {
    console.log(req.headers)
    const secret = 'random string that should be secret'
    const verifiedUser = jwt.verify(req.headers.authorization, secret)
    
    if (!verifiedUser) {
        return res.status(401).send({
            success: false,
            message: 'Invalid token'
        })
    }

    const user = await User.findById(verifiedUser.id)

    return res.status(200).send({
        success: true,
        user: {
            username: user.username,
            posts: user.posts,
            id: user._id,
            admin: user.admin
        }
    })
}