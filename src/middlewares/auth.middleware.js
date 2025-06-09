const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Bearer header
    
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add decoded user info to request object
        req.user = decoded; // Contains { id, role }
        
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Middleware to check specific roles
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: 'Access denied: insufficient permissions' 
            });
        }
        next();
    };
};

module.exports = {
    verifyToken,
    checkRole
};