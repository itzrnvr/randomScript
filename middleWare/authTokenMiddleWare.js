const rateLimit = require('express-rate-limit');

// Apply rate limiting middleware to /api/chat endpoint.
const limiter = rateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 1 // limit each IP to 1 requests per windowMs
});

// Bearer token authentication middleware.
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401) // if there isn't any token

  // Call your validation function/strategy here
  // if (verifyToken(token) === false) return res.sendStatus(403)
  
  next() // valid token, proceed 
}

module.exports = {authenticateToken}