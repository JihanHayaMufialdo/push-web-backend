module.exports = (req, res, next) => {
    req.user = {
        id: '123e4567-e89b-12d3-a456-426614174000'
    };

    next();
};