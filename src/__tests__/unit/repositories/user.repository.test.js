// Update the import paths (add one more level up)
const { User } = require('../../../models');
const userRepository = require('../../../repositories/user.repository');

// Mock the User model
jest.mock('../../../models', () => ({
    User: {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn()
    }
}));

describe('UserRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create a user successfully', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'patient'
            };
            const createdUser = { id: 1, ...userData };
            
            User.create.mockResolvedValue(createdUser);

            const result = await userRepository.createUser(userData);

            expect(User.create).toHaveBeenCalledWith(userData);
            expect(result).toEqual(createdUser);
        });

        it('should throw error if user creation fails', async () => {
            const error = new Error('Creation failed');
            User.create.mockRejectedValue(error);

            await expect(userRepository.createUser({})).rejects.toThrow(error);
        });
    });

    describe('getUserById', () => {
        it('should return user when found', async () => {
            const user = { id: 1, name: 'John Doe' };
            User.findByPk.mockResolvedValue(user);

            const result = await userRepository.getUserById(1);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(result).toEqual(user);
        });

        it('should return null when user not found', async () => {
            User.findByPk.mockResolvedValue(null);

            const result = await userRepository.getUserById(999);

            expect(User.findByPk).toHaveBeenCalledWith(999);
            expect(result).toBeNull();
        });

        it('should throw error if database query fails', async () => {
            const error = new Error('Database error');
            User.findByPk.mockRejectedValue(error);

            await expect(userRepository.getUserById(1)).rejects.toThrow(error);
        });
    });

    describe('updateUser', () => {
        it('should update user successfully', async () => {
            const userId = 1;
            const userData = { name: 'Updated Name' };
            const mockUser = {
                id: userId,
                name: 'Original Name',
                update: jest.fn().mockImplementation(async function() {
                    this.name = userData.name;
                    return this;
                })
            };

            User.findByPk.mockResolvedValue(mockUser);

            const result = await userRepository.updateUser(userId, userData);

            expect(User.findByPk).toHaveBeenCalledWith(userId);
            expect(mockUser.update).toHaveBeenCalledWith(userData);
            expect(result).toEqual({
                id: userId,
                name: 'Updated Name',
                update: expect.any(Function)
            });
        });

        it('should throw error if user not found', async () => {
            User.findByPk.mockResolvedValue(null);

            await expect(userRepository.updateUser(999, {})).rejects.toThrow('User not found');
        });

        it('should throw error if update fails', async () => {
            const mockUser = {
                update: jest.fn().mockRejectedValue(new Error('Update failed'))
            };
            User.findByPk.mockResolvedValue(mockUser);

            await expect(userRepository.updateUser(1, {})).rejects.toThrow('Update failed');
        });
    });

    describe('getAllPatients', () => {
        it('should return all patients', async () => {
            const mockPatients = [
                { name: 'Patient 1', email: 'p1@example.com', phone: '1234', address: 'Address 1' },
                { name: 'Patient 2', email: 'p2@example.com', phone: '5678', address: 'Address 2' }
            ];

            User.findAll.mockResolvedValue(mockPatients);

            const result = await userRepository.getAllPatients();

            expect(User.findAll).toHaveBeenCalledWith({
                where: { role: 'patient' },
                attributes: ['name', 'email', 'phone', 'address']
            });
            expect(result).toEqual(mockPatients);
        });

        it('should throw error if fetching patients fails', async () => {
            const error = new Error('Database error');
            User.findAll.mockRejectedValue(error);

            await expect(userRepository.getAllPatients()).rejects.toThrow(error);
        });
    });
});