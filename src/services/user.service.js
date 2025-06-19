const userRepository = require('../repositories/user.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Department } = require('../models');
const { logAction } = require('../utils/logger');

class UserService {
    async createUser(userData) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            
            const user = await userRepository.createUser({
                ...userData,
                password: hashedPassword
            });
            
            const { password, ...userWithoutPassword } = user.toJSON();

            await logAction(
                'User Created',
                null,
                {
                    newUserId: user.id,
                    role: userData.role,
                    email: userData.email
                }
            );
         
            return userWithoutPassword;
        } catch (error) {
            throw error;
        }
    }

    async loginUser(email, password, role) {
        try {
            const user = await User.findOne({ where: { email, role } });
            if (!user) {
                throw new Error('Invalid credentials');
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                throw new Error('Invalid credentials');
            }

            console.log(user.role);

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            const { password: _, ...userWithoutPassword } = user.toJSON();
            return {
                ...userWithoutPassword,
                token
            };
        } catch (error) {
            throw error;
        }
    }

    async getAllPatients() {
        try {
            const patients = await userRepository.getAllPatients();
            return { patients };
        } catch (error) {
            throw error;
        }
    }

    async updateUser(userId, userData) {
        try {
            if (userData.password) {
                const salt = await bcrypt.genSalt(10);
                userData.password = await bcrypt.hash(userData.password, salt);
            }

            const { role, email, ...updateData } = userData;

            const updatedUser = await userRepository.updateUser(userId, updateData);

            await logAction(
                'User Updated',
                userId,
                {
                    updatedFields: Object.keys(updateData).join(', ')
                }
            );

            const { password, ...userWithoutPassword } = updatedUser.toJSON();
            return userWithoutPassword;
        } catch (error) {
            throw error;
        }
    }

    async getUserWithDepartment(userId) {
        try {
            const user = await User.findOne({
                where: { id: userId },
                include: [{
                    model: Department,
                    through: DoctorDepartment,
                    attributes: ['id', 'name']
                }],
                attributes: ['id', 'name', 'email', 'role', 'age', 'gender', 'phone', 'address']
            });
            return user;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserService();