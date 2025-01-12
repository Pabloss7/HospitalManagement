const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');

const SALT = 10;

const createUser = async(username, password, role, details) => {
    const hashedPassword = await bcrypt.hash(password, SALT);
    
    const user = await userRepository.createUser(username, hashedPassword, role, details);

    return user;
};

module.exports = { createUser };