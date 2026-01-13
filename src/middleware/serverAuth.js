module.exports = (req, res, next) => {
    const { token } = req.query;
  
    const username = '3877';
  
    if (!token) {
      return res.status(403).json({
        message: 'No token provided'
      });
    }
  
    if (token !== username) {
      return res.status(401).json({
        message: 'Invalid token'
      });
    }
    req.user = { username };
  
    next();
  };