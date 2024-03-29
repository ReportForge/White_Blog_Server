const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

// User registration
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate a random verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit code

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      verificationCode, // Store this code with the user record
      isVerified: false, // Initially, the user is not verified
    });

    // Send the verification email with the code
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


const sendVerificationEmail = async (userEmail, verificationCode) => {
  try {
    // Set up mail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // For Gmail, or use another service
      auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your email account password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL, // Sender address
      to: userEmail, // Recipient address
      subject: 'Verify Your Email Address',
      html: `
        <h1>Email Verification</h1>
        <p>Thank you for registering. Please verify your email address by entering the following code in the application:</p>
        <p><b>${verificationCode}</b></p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    // Send verification email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending verification email: ', error);
        throw error; // Or handle this error appropriately
      } else {
        console.log('Verification email sent: ' + info.response);
      }
    });
  } catch (error) {
    console.error('sendVerificationEmail error:', error);
    throw error; // Ensure this error is caught or handled where the function is called
  }
};


// Email verification
const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    user.emailVerified = true; // Mark the user as verified
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// User login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const googleLogin = async (req, res) => {
  const { tokenId } = req.body; // ID token provided by Google on the client side

  try {
    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });

    const payload = ticket.getPayload(); // Get user info from the payload

    // Check if the user exists in the database
    let user = await User.findOne({ email: payload['email'] });

    if (user) {
      // User exists
      // if (user.profilePicture !== payload['picture']) {
      //   user.profilePicture = payload['picture'];
      //   await user.save();
      // }
    } else {
      // Create a new user with information from Google
      user = new User({
        firstName: payload['given_name'],
        lastName: payload['family_name'],
        email: payload['email'],
        emailVerified: true, // Email is verified by Google
        isEditor: false, // Default value, adjust as necessary
        profilePicture: payload['picture'] || '', // Use Google profile picture if available
        password: 'google auth',
        // Since this user is registered via Google, some fields like password are not applicable
        // For fields like verificationCode, resetPasswordToken, and resetPasswordExpire, set default or placeholder values as they are not applicable for Google-authenticated users
      });

      await user.save();
    }

    // Generate a token for the session
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    // Respond with the token and user information
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { register, login, verifyEmail, googleLogin };
