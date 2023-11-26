const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    
    const [bearer, token] = authHeader.split(' ');
    
    if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Unauthorized: Invalid authorization format' });
    }
    
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized: Token expired' });
        }
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    try {
        // Remove 'Bearer ' prefix from the token
        const tokenWithoutBearer = token.replace('Bearer ', '');
        
        // Verify the token using the secret key
        const decoded = jwt.verify(tokenWithoutBearer, config.JWT_SECRET);
        
        // Set the decoded user information in req.user
        req.user = decoded.user;
        
        // Move to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateToken;
module.exports = verifyToken;
