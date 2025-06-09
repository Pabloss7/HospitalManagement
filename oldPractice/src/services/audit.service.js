const auditRepository =  require('../repositories/audit.repository');

const logAction = async ( user_id, action, resource ) => {
    await auditRepository.logAction(user_id,action,resource);
};

module.exports = { logAction };