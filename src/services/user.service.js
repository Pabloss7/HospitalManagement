const userRepository = require('../repositories/user.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Department } = require('../models');
const { logAction } = require('../utils/logger');

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

            // Log the user creation action
            await logAction(
                'User Created',
                null, // No userId since this is a new user creation
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
            // Find user by email and role
            const user = await User.findOne({ where: { email, role } });
            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Verify password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                throw new Error('Invalid credentials');
            }

            console.log(user.role);
            // Generate JWT token
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
            // If password is being updated, hash it
            if (userData.password) {
                const salt = await bcrypt.genSalt(10);
                userData.password = await bcrypt.hash(userData.password, salt);
            }

            // Remove fields that shouldn't be updated
            const { role, email, ...updateData } = userData;

            // Update user
            const updatedUser = await userRepository.updateUser(userId, updateData);
            
            // Log the update action
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
}

module.exports = new UserService();