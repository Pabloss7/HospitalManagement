const UserService = require('../../../services/user.service');
const userRepository = require('../../../repositories/user.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../../models');

// Mock the dependencies
jest.mock('../../../repositories/user.repository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../../utils/logger');
jest.mock('../../../models', () => ({
    User: {
        findOne: jest.fn()
    }
}));

describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create a user successfully', async () => {
            // Arrange
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'patient'
            };
            const hashedPassword = 'hashedPassword';
            const createdUser = {
                id: 1,
                ...userData,
                password: hashedPassword,
                toJSON: () => ({
                    id: 1,
                    ...userData,
                    password: hashedPassword
                })
            };

            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue(hashedPassword);
            userRepository.createUser.mockResolvedValue(createdUser);

            // Act
            const result = await UserService.createUser(userData);

            // Assert
            expect(result).toEqual({
                id: 1,
                name: userData.name,
                email: userData.email,
                role: userData.role
            });
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 'salt');
            expect(userRepository.createUser).toHaveBeenCalledWith({
                ...userData,
                password: hashedPassword
            });
        });

        it('should throw an error if user creation fails', async () => {
            // Arrange
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'patient'
            };
            const error = new Error('Creation failed');
            userRepository.createUser.mockRejectedValue(error);

            // Act & Assert
            await expect(UserService.createUser(userData)).rejects.toThrow('Creation failed');
        });
    });

    describe('loginUser', () => {
        it('should login user successfully', async () => {
            // Arrange
            const credentials = {
                email: 'test@example.com',
                password: 'password123',
                role: 'patient'
            };
            const user = {
                id: 1,
                ...credentials,
                name: 'Test User',
                password: 'hashedPassword',
                toJSON: () => ({
                    id: 1,
                    name: 'Test User',
                    ...credentials,
                    password: 'hashedPassword'
                })
            };
            const token = 'generated-token';

            jest.spyOn(User, 'findOne').mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue(token);

            // Act
            const result = await UserService.loginUser(
                credentials.email,
                credentials.password,
                credentials.role
            );

            // Assert
            expect(result).toEqual({
                id: 1,
                name: 'Test User',
                email: credentials.email,
                role: credentials.role,
                token
            });
            expect(bcrypt.compare).toHaveBeenCalledWith(
                credentials.password,
                user.password
            );
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
        });

        it('should throw error for invalid credentials', async () => {
            // Arrange
            const credentials = {
                email: 'test@example.com',
                password: 'wrong-password',
                role: 'patient'
            };
            jest.spyOn(User, 'findOne').mockResolvedValue(null);

            // Act & Assert
            await expect(
                UserService.loginUser(
                    credentials.email,
                    credentials.password,
                    credentials.role
                )
            ).rejects.toThrow('Invalid credentials');
        });

        it('should throw error for invalid password', async () => {
            // Arrange
            const credentials = {
                email: 'test@example.com',
                password: 'wrong-password',
                role: 'patient'
            };
            const user = {
                id: 1,
                ...credentials,
                password: 'hashedPassword'
            };
            jest.spyOn(User, 'findOne').mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(false);

            // Act & Assert
            await expect(
                UserService.loginUser(
                    credentials.email,
                    credentials.password,
                    credentials.role
                )
            ).rejects.toThrow('Invalid credentials');
        });
    });

    describe('getAllPatients', () => {
        it('should return all patients', async () => {
            // Arrange
            const patients = [
                { id: 1, name: 'Patient 1', role: 'patient' },
                { id: 2, name: 'Patient 2', role: 'patient' }
            ];
            userRepository.getAllPatients.mockResolvedValue(patients);

            // Act
            const result = await UserService.getAllPatients();

            // Assert
            expect(result).toEqual({ patients });
            expect(userRepository.getAllPatients).toHaveBeenCalled();
        });

        it('should throw error if repository fails', async () => {
            // Arrange
            const error = new Error('Database error');
            userRepository.getAllPatients.mockRejectedValue(error);

            // Act & Assert
            await expect(UserService.getAllPatients()).rejects.toThrow('Database error');
        });
    });
});