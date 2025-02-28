const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    let token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Remove "Bearer " prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7).trim();
    }

    // Debugging: Log the token (remove in production)
    console.log('Received Token:', token);

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Debugging: Log decoded payload
    console.log('Decoded Token:', decoded);

    // Ensure token contains user ID
    if (!decoded.id) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // Find user in database to ensure they still exist
    const user = await User.findById(decoded.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(401).json({ message: 'User not found. Authorization denied.' });
    }

    // Attach user object to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication Middleware Error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = authenticateUser;
