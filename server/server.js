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
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

  
// Define routes
app.use('/api/posts', postsRoute);
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
