const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const User = require("./models/user");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "random string that should be secret";

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ _id: jwt_payload.id }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);

const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8000/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            return done(null, user);
          } else {
            const newUser = {
              googleId: profile.id,
              username: profile.displayName,
              password: null,
              fname: profile.name.givenName,
              lname: profile.name.familyName,
              admin: false,
              posts: [],
              comments: [],
            };
            let user = await User.create(newUser);
            console.log(user);
            // const payload = {
            //   id: user._id,
            //   username: user.username,
            //   admin: user.admin,
            //   posts: user.posts,
            // };
            // const token = jwt.sign(
            //   payload,
            //   "random string that should be secret",
            //   {
            //     expiresIn: "1d",
            //   }
            // );
            return done(null, user);
            // res.status(200).send({
            //   success: true,
            //   message: "Logged in successfully",
            //   token: token,
            //   // this becomes currentUser
            //   user: {
            //     id: user._id,
            //     username: user.username,
            //     admin: user.admin,
            //     posts: user.posts,
            //   },
            // });
          }
        } catch (err) {
          console.log(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
