module.exports = (req, res, next) => {
    req.user = {
      nip: '00000',
    //   role: 'admin'
    };
  
    req.isAdmin = true;
  
    next();
  };

// module.exports = (req, res, next) => {
//   const { nip } = req.body;

//   if (!nip) {
//     return res.status(400).json({ error: 'NIP is required' });
//   }

//   // attach user object to request
//   req.user = { nip };
//   req.isAdmin = true;

//   next();
// };

  