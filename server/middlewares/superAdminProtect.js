const jwt = require('jsonwebtoken');
const User = require('../models/User');

const superAdminProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied. Super admin only.' });
    }

    req.User = user;
    next();
  } catch (error) {
    console.error('Error in super admin auth middleware:', error);
    res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = superAdminProtect;
