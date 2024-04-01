const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('./models/User');

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "https://whiteblog-ffb7cfa6fd24.herokuapp.com/api/auth/twitter/callback"
  },
  async (token, tokenSecret, profile, cb) => {
    console.log("Twitter auth callback function called.");
    let user = await User.findOne({ twitterId: profile.id });
    if (user) {
      return cb(null, user);
    } else {
      // Create a new user with a default password and empty names if Twitter doesn't provide them
      user = new User({
        twitterId: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        firstName: 'TwitterUser', // Default value, consider prompting the user to update it later
        lastName: '', // Default value, consider prompting the user to update it later
        email: `${profile.username}@twitter.com`, // Default value, consider prompting the user for a real email later
        password: 'twitter', // Consider using a more secure default password or a password hash
        emailVerified: true // Assuming Twitter accounts are verified
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
