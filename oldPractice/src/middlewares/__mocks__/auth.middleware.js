module.exports = {
    authenticate: (allowedRoles = []) => (req, res, next) => {
        // Simula un usuario autenticado con un rol permitido
        req.user = { id: 1, role: allowedRoles[0] || 'admin' }; 
        next();
    },
};
