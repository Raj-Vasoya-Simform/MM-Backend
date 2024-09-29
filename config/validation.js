const jwt = require('jsonwebtoken');
const SECRET_KEY = "NOTES@_API";
const authenticateToken = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
        return res.status(401).json({ error: 'Access denied. Token not provided.' });
    }

    const tokenParts = authorizationHeader.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Invalid authorization header format.' });
    }

    const token = tokenParts[1].trim(); // Trim any extra whitespace

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.log(err)
            return res.status(403).json({ error: 'Invalid token.' });
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
