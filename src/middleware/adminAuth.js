const jwt = require('jsonwebtoken');
const config = require('../config/auth');

// module.exports = (req, res, next) => {
//   req.user = {
//     username: 'bpiadmin',
//   };

//   req.isAdmin = true;

//   next();
// };

module.exports = (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({
      message: 'No token provided'
    });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    req.user = decoded;

    next();
  });
};


  