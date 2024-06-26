const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('./models/User');
const crypto = require('crypto');

function generateRandomPassword(length) {
  return crypto.randomBytes(length).toString('hex');
}

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: "https://whiteblog-ffb7cfa6fd24.herokuapp.com/api/auth/twitter/callback",
  includeEmail: true
},
  async (token, tokenSecret, profile, cb) => {
    console.log("Twitter auth callback function called.");
    const email = profile.emails && profile.emails[0].value;
    const nameParts = profile.displayName.split(' ');
    const firstName = nameParts[0] || 'TwitterUser'; // Use the first part as the first name, default if empty
    const lastName = nameParts.slice(1).join(' ') || ''; // Join the rest as the last name, empty if none
    const randomPassword = generateRandomPassword(16); 
    let user = await User.findOne({ email: email });
    if (user) {
      return cb(null, user);
    } else {
      // Create a new user with a default password and empty names if Twitter doesn't provide them
      user = new User({
        twitterId: profile.id,
        firstName: firstName, // Default value, consider prompting the user to update it later
        lastName: lastName, // Default value, consider prompting the user to update it later
        email: email, // Default value, consider prompting the user for a real email later
        password: randomPassword, // Consider using a more secure default password or a password hash
        emailVerified: true,
        profilePicture: profile.photos && profile.photos[0].value
         // Assuming Twitter accounts are verified
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
