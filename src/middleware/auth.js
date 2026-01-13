// module.exports = (req, res, next) => {
//     req.user = {
//         nip: '14045'
//     };

//     next();
// };

// module.exports = (req, res, next) => {
//     const { nip } = req.body;
  
//     if (!nip) {
//       return res.status(400).json({ error: 'NIP is required' });
//     }
  
//     req.user = { nip };
  
//     next();
// };
const jwt = require('jsonwebtoken');
const config = require('../config/auth');

module.exports = (req, res, next) => {
    const { device_id } = req.query;
  
    if (!device_id) {
      return res.status(400).json({ error: 'Device ID is required' });
    }
  
    req.user = { device_id };
  
    next();
};

// module.exports = (req, res, next) => {
//   let token = req.headers.authorization;

//   console.log('RAW AUTH HEADER:', token);

//   if (!token) {
//     return res.status(401).json({ error: 'Authorization required' });
//   }

//   if (token.startsWith('Bearer ')) {
//     token = token.slice(7);
//   }

//   console.log('JWT TO VERIFY:', token);

//   jwt.verify(token, config.jwt.secret, (err, decoded) => {
//     if (err) {
//       console.error('JWT ERROR:', err.message);
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     console.log('JWT DECODED:', decoded);
//     req.user = decoded;
//     next();
//   });
// };

  
