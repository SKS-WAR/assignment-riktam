const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // Generate and send a JWT token
        const token = jwt.sign({ userId: user._id, username: user.username }, config.JWT_SECRET, {
          expiresIn: '1h', // Token expiration time
        });

        return res.status(200).json({ message: 'Login successful', token });
      }
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const logout = (req, res) => {
  // If you were using JWT for session management, you might want to clear the client-side token
  // On the server side, you can simply acknowledge the logout
  return res.status(200).json({ message: 'Logout successful' });
};

module.exports = {
  login,
  logout,
};
