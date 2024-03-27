const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const postsRoute = require('./routes/blogPostRoutes');
const usersRoute = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Increase the limit for the JSON body parser and Increase the limit for the URL-encoded body parser
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));


app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));


// Define routes
app.use('/api/posts', postsRoute);
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoutes);


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.get('/', (req, res) => {
  res.send('Hello, World!');
});
