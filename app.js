var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const session = require("express-session");

const mongoDB = process.env.MONGO_DB;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var apiRouter = require("./routes/apiRouter");

var app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://morning-meadow-95658.herokuapp.com",
      "https://blog.kurtgray.dev",
    ],
    credentials: true,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//JWT STRATEGY
app.use(passport.initialize());

require("./auth");

app.use(passport.initialize());

app.use("/", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error..." + err);
});

module.exports = app;
