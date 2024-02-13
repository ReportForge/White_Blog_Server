const User = require('../models/User');

const userController = {
  // Get a user profile
  async getUserProfile(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update a user profile
  async updateUserProfile(req, res) {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

};//end


module.exports = userController;
