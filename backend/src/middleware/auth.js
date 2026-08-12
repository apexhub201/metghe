// backend/src/middleware/auth.js
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  // Public routes
  const publicPaths = ['/api/validate-key', '/api/links/click'];
  if (publicPaths.includes(req.path)) {
    return next();
  }
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    // Verify JWT or session token
    // This is a simplified example
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const verifyToken = (token) => {
  // Implement proper JWT verification
  // This should use jsonwebtoken library in production
  return { userId: 'admin', role: 'admin' };
};

module.exports = authMiddleware;
