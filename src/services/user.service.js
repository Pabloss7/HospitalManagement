const userRepository = require('../repositories/user.repository');
const bcrypt = require('bcrypt');
const { User, Department } = require('../models');

class UserService {
    async createUser(userData) {
        try {
            // Hash password before creating user
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            
            // Create user with hashed password
            const user = await userRepository.createUser({
                ...userData,
                password: hashedPassword
            });
            
            const { password, ...userWithoutPassword } = user.toJSON();
            return userWithoutPassword;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserService();