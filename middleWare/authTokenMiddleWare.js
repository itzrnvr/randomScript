const rateLimit = require('express-rate-limit');

// Rate limiting middleware to limit requests to the API.
const limiter = rateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 1 // Limit each IP to 1 request per windowMs
});

// Bearer token authentication middleware.
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.status(401).send('No token provided');
  }
  if (!verifyToken(token)) {
    return res.status(403).send('Token is invalid');
  }
  next(); // valid token, proceed
};

// The function to verify the provided token.
function verifyToken(token) {
  // Hardcoded list of valid tokens for simplicity.
  const validTokens = [
    'lmao97001',
    'aditi97001',
    // Add more tokens as needed
  ];
  return validTokens.includes(token);
}


module.exports = { authenticateToken };