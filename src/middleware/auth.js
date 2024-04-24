const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;


module.exports = function (req, res, next) {
  let token = req.headers['authorization'];
  
  let checkBearer = "Bearer ";
  
  if (token) {
    if (token.startsWith(checkBearer)) {
      token = token.slice(checkBearer.length);
    }

    

    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    // console.log(decoded)
    jwt.verify(token, secretKey,async (err, decoded) => {
      
      if (err) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
      } else {
        // If token is valid, save decoded information to request object
        req.decoded = decoded;
        next(); // Move to the next middleware or route handler
      }
    });
  } else {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
};

