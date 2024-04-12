const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session'); // New line
const postsRoute = require('./routes/blogPostRoutes');
const usersRoute = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const path = require('path');
const passport = require('passport');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(cors());

// Session middleware - New section
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_session_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: 'auto', httpOnly: true, maxAge: 3600000 }
}));

app.use(passport.initialize());
app.use(passport.session());
require('./passport-setup');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define routes
app.use('/api/posts', postsRoute);
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoutes);

// Serve static files from the public directory
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


// Serve the PDF
app.get('/pdf', (req, res) => {
  const filePath = path.join(__dirname, 'Terms_of_Service_White_Blog.pdf');
  res.sendFile(filePath, err => {
    if (err) {
      console.error('Error sending PDF file:', err);
      res.status(500).send('An error occurred');
    }
  });
});
