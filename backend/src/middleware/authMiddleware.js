const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// Middleware to verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      // Fetch user from DB (excluding password)
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      });

      if (!user) {
        return res.status(401).json({ message: 'User not found or deleted' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }
};

// Middleware for Role-Based Access Control (RBAC)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Access requires one of [${roles.join(', ')}] roles`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
