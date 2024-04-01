const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('./models/User');

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "https://monumental-florentine-67199f.netlify.app/"
  },
  async (token, tokenSecret, profile, cb) => {
    // Here, you will find or create a user in your database
    // Check if user already exists in your database
    console.log("Its get here");
    let user = await User.findOne({ twitterId: profile.id });
    if (user) {
      return cb(null, user);
    } else {
      // If not, create a new user in your DB
      user = new User({
        twitterId: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        // Add other fields as necessary
      });

      await user.save();
      return cb(null, user);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
