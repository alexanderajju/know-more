const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { userCollection } = require("./config/collections");
const db = require("./config/connection");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (User, user, done) {
  // User.findById(id, function (err, user) {
  //   done(err, user);
  // });
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "825102022392-14fc0bbnh7g26fcoltn4k3i2nui5ee4u.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // User.findOrCreate({ googleId: profile.id }, function (err, profile) {
      //   return done(err, profile);
      // });
      let user = await db
        .get()
        .collection(userCollection)
        .findOne({ sub: profile.id });
      // console.log(profile._json);
      if (user) {
        // console.log("user found");
        // console.log(user);
        profile._json._id = user._id;
        return done(null, profile);
      } else {
        // console.log("user doesn't exit");
        profile._json.customer = true;
        db.get()
          .collection(userCollection)
          .insertOne(profile._json)
          .then((doc) => {
            profile._json._id = doc.ops[0]._id;
            // console.log("passport>>>>>>>>>>>>>>>>>>>>>>>");
            console.log(profile._json._id);
            console.log(profile);
          });
        return done(null, profile);
      }
    //   console.log(profile);
    //   return done(null, profile);
    }
  )
);
