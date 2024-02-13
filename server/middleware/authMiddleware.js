// middleware/authMiddleware.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user to the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const isEditor = async (req, res, next) => {
  const user = await User.findById(req.user.userId);

  if (!user || !user.isEditor) {
    return res.status(403).json({ message: 'You do not have permission to perform this action' });
  }

  next();
};

module.exports = { isAuthenticated, isEditor };
