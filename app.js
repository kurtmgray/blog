var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const MongoStore = require('connect-mongo')
const passport = require('passport')

const session = require("express-session");
require('dotenv').config()

const mongoDB = process.env.MONGO_DB
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport.use(
//   new LocalStrategy((username, password, done) => {
//     User.findOne({ username: username }, (err, user) => {
//       if (err) return done(err);
//       if (!user) return done(null, false, { message: "Incorrect username" });
//       bcrypt.compare(password, user.password, (err, res) => {
//         if (res) return done(null, user)
//         else return done(null, false, { message: "Incorrect password" })
//       })    
//     });
//   })
// );

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));

app.use(session(
  {
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB,
      collectionName: 'sessions'
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 *24
    }
  }
));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
