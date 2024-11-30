const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const jwtMiddleware = (req, res, next) => {
    const publicRoutes = ['/auth/login', '/auth/signup'];

    // Check if the current route is in the public routes
    if (publicRoutes.includes(req.path)) {
        return next(); // Skip middleware for these routes
    }
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify the token using your secret key
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);
    console.log(decoded);
    // Add email from the token to the request object
    if (decoded && decoded.email) {
      req.body.email = decoded.email;
    } else {
      return res.status(400).json({ error: 'Invalid token: email not found' });
    }
    console.log("here");
    next(); // Proceed to the next middleware or route
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = jwtMiddleware;