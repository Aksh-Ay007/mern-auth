import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token || req.header('Authorization')?.split(' ')[1]; // First check cookies, then check Authorization header

  if (!token) {
    return next(errorHandler(401, 'You are not authenticated!'));
  }

  jwt.verify(token, process.env.JWT_SECRET_ADMIN, (err, user) => {
    if (err) {
      return next(errorHandler(403, 'Token is not valid!'));
    }

    req.user = user; // Attach the decoded user info to the request
    next();
  });
};
