const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Email verification
router.post('/verify-email', authController.verifyEmail);

// New route for Google authentication
router.post('/google-login', authController.googleLogin);

// Twitter Authentication Route
router.get('/twitter', passport.authenticate('twitter'));


// Twitter Callback Route
router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }),
    (req, res) => {
        if (req.user) {
            // Generate a token for the session
            const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

            // Redirect to the frontend with the token and user data in the URL
            const frontendURL = 'http://localhost:3001/twitter-callback';
            res.redirect(`${frontendURL}?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
        } else {
            // Redirect to a failure page or the login page with an error message
            res.redirect(`/login?error='Authentication failed'`);
        }
    }
);





module.exports = router;
