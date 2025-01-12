const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';

const authenticate = (allowedRoles = []) => {
    return (req, res, next) => {
        const token = req.headers['authorization'];
        if(!token){
            return res.status(401).json({ message: 'Not authorized, tojen missing'});
        }

        try{
            const decoded = jwt.verify(token, SECRET_KEY);

            req.user  = decoded;

            if(allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)){
                return res.status(403).json({ message: 'Ascess denied'});
            }

            next();
        }catch(error){
            return res.status(403).json({message: 'Invalid token'});
        }
    };
};

module.exports = { authenticate };