const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Use the Customer model instead of User model
    req.User = await User.findById(decoded.id);
    // console.log("customer",req.User);

    
    if (!req.User) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = protect;
