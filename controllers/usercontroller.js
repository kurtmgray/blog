const User = require('../models/user')
const { body, validationResult } = require('express-validator')
const { hashSync, compare } = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken')

exports.create_user_post = 
// [

//   body('fname').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
//     .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
//   body('lname').trim().isLength({ min: 1 }).escape().withMessage('Last name must be specified.')
//     .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
//   body('username').trim().isLength({ min: 1 }).escape().withMessage('Username must be specified.')
//     .isAlphanumeric().withMessage('Username has non-alphanumeric characters.'),
//   body('password').trim().isLength({ min: 6 }).escape().withMessage('Password must be at least 6 characters.'),

  (req, res, next) => {
      console.log('reqbody', req)
  
    // const errors = validationResult(req);
  
    // if (!errors.isEmpty()) { 
    //   res.json({ errors: errors })
    // }
    // else {  
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
//   }   
// ] 

exports.log_in_post = async (req, res, next) => {
    console.log(await req.body)
    const user = await User.find({ username: req.body.username })
    const password = await req.body.password
        
    if (!user) {
        return res.status(401).json({ 
            success: false,
            message: 'User does not exist' 
        })
    }
    if(!compare(password, user.password)) {
        return res.status(401).json({ 
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

    return res.status(200).json({ 
        success: true,
        message: 'Logged in successfully',
        token: 'Bearer ' + token
    })
    
}

