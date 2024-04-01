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
    console.log(profile);
    const nameParts = profile.displayName.split(' ');
    const firstName = nameParts[0] || 'TwitterUser'; // Use the first part as the first name, default if empty
    const lastName = nameParts.slice(1).join(' ') || ''; // Join the rest as the last name, empty if none
    let user = await User.findOne({ twitterId: profile.id });
    if (user) {
      return cb(null, user);
    } else {
      // Create a new user with a default password and empty names if Twitter doesn't provide them
      user = new User({
        twitterId: profile.id,
        firstName: firstName, // Default value, consider prompting the user to update it later
        lastName: lastName, // Default value, consider prompting the user to update it later
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
