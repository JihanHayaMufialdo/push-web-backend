module.exports = (req, res, next) => {
    req.user = {
      id: '625e4567-e89b-12d3-a456-426614174111',
    //   role: 'admin'
    };
  
    req.isAdmin = true;
  
    next();
  };
  