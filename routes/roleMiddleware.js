// authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const roleMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing or malformed' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: 'Access denied: Insufficient role' });
    }
    
    req.user = user; // Store user in request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = {roleMiddleware};
