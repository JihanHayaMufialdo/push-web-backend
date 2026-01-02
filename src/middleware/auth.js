// module.exports = (req, res, next) => {
//     req.user = {
//         nip: '2902'
//     };

//     next();
// };

module.exports = (req, res, next) => {
    const { nip } = req.body;
  
    if (!nip) {
      return res.status(400).json({ error: 'NIP is required' });
    }
  
    req.user = { nip };
  
    next();
};
  
