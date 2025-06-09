const userRepository = require('../repositories/user.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
}

module.exports = new UserService();