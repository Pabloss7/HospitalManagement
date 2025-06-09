const { User } = require('../models');

class UserRepository {
    async createUser(userData) {
        try {
            const user = await User.create(userData);
            return user;
        } catch (error) {
            throw error;
        }
    }
    async getUserById(userId) {
        try {
            const user = await User.findByPk(userId);
            return user;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserRepository();