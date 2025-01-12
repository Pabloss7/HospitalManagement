const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';

const authenticate = (allowedRoles = []) => {
    return (req, res, next) => {
        console.log("TRIGGERED");
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Token missing' });
        }

        // Verifica si el token empieza con "Bearer"
        if (!token.startsWith("Bearer ")) {
            return res.status(400).json({ message: 'Invalid token format. Expected "Bearer <token>"' });
        }
     
        // Extrae solo la parte del token
        const jwtToken = token.split(' ')[1];
        try {
            const decoded = jwt.verify(jwtToken, SECRET_KEY);
            req.user = decoded;

            // Verifica los roles permitidos
            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
            }

            next();
        } catch (error) {
            console.error("JWT Verification Error:", error);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Unauthorized: Token expired' });
            }
            return res.status(403).json({ message: 'Invalid token' });
        }
    };
};

module.exports = { authenticate };
