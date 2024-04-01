const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');

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
    async (req, res) => {
        // Successful authentication
        console.log("User authenticated successfully with Twitter.");

        if (req.user) {
            // Generate a token for the session
            const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

            // Optionally, you could fetch more detailed user information here if needed

            // Respond with the token and user information as JSON
            res.json({ token, user: req.user });
        } else {
            // Handle case where req.user is not available
            res.status(400).json({ message: "Authentication successful, but user information is not available." });
        }
    }
);




module.exports = router;
