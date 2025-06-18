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
    async updateUser(userId, userData) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }
            
            await user.update(userData);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getAllPatients() {
        try {
            const patients = await User.findAll({
                where: { role: 'patient' },
                attributes: ['name', 'email', 'phone', 'address']
            });
            return patients;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserRepository();