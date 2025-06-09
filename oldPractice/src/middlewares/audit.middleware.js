const auditService = require('../services/audit.service');

const audit = (action, resource) => {
    return (req, res, next) => {
        if (req.user) {
            auditService.logAction(req.user.id, action, resource)
                .catch((error) => console.error('Error logging action:', error.message));
        }
        next();
    };
};

module.exports = { audit };
