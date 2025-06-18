const userController = require('../../../controllers/user.controller');
const userService = require('../../../services/user.service');
const departmentService = require('../../../services/department.service');

// Mock the services
jest.mock('../../../services/user.service');
jest.mock('../../../services/department.service');

describe('User Controller', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockReq = {
            user: { id: 1 },
            body: {}
        };
    });

    describe('createPatient', () => {
        const patientData = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            age: 30,
            gender: 'male',
            address: '123 Main St',
            phone: '1234567890'
        };

        it('should successfully create a patient', async () => {
            mockReq.body = patientData;
            const expectedUser = { ...patientData, id: 1, role: 'patient' };
            userService.createUser.mockResolvedValue(expectedUser);

            await userController.createPatient(mockReq, mockRes);

            expect(userService.createUser).toHaveBeenCalledWith({
                ...patientData,
                role: 'patient'
            });
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(expectedUser);
        });

        it('should return 400 if email already exists', async () => {
            mockReq.body = patientData;
            const error = new Error('Email exists');
            error.name = 'SequelizeUniqueConstraintError';
            userService.createUser.mockRejectedValue(error);

            await userController.createPatient(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Email already exists' });
        });
    });

    describe('createDoctor', () => {
        const doctorData = {
            name: 'Dr. Smith',
            email: 'smith@example.com',
            password: 'password123',
            department: 'Cardiology',
            age: 40,
            gender: 'female',
            address: '456 Hospital St',
            phone: '0987654321'
        };

        it('should successfully create a doctor', async () => {
            mockReq.body = doctorData;
            const expectedUser = { ...doctorData, id: 1, role: 'doctor' };
            const mockDepartment = { id: 1, name: 'Cardiology' };
            
            departmentService.getDepartmentByName.mockResolvedValue(mockDepartment);
            userService.createUser.mockResolvedValue(expectedUser);
            departmentService.assignDoctorToDepartment.mockResolvedValue(true);

            await userController.createDoctor(mockReq, mockRes);

            expect(departmentService.getDepartmentByName).toHaveBeenCalledWith('Cardiology');
            expect(userService.createUser).toHaveBeenCalledWith({
                ...doctorData,
                role: 'doctor'
            });
            expect(departmentService.assignDoctorToDepartment).toHaveBeenCalledWith(1, 1);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(expectedUser);
        });

        it('should return 400 if department is invalid', async () => {
            mockReq.body = doctorData;
            departmentService.getDepartmentByName.mockResolvedValue(null);

            await userController.createDoctor(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid department' });
        });
    });

    describe('createAdmin', () => {
        const adminData = {
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            age: 35,
            gender: 'male',
            address: '789 Admin St',
            phone: '1122334455'
        };

        it('should successfully create an admin', async () => {
            mockReq.body = adminData;
            const expectedUser = { ...adminData, id: 1, role: 'admin' };
            userService.createUser.mockResolvedValue(expectedUser);

            await userController.createAdmin(mockReq, mockRes);

            expect(userService.createUser).toHaveBeenCalledWith({
                ...adminData,
                role: 'admin'
            });
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(expectedUser);
        });
    });

    describe('updateOwnProfile', () => {
        const updateData = {
            name: 'Updated Name',
            email: 'updated@example.com',
            phone: '9876543210',
            address: 'Updated Address'
        };

        it('should successfully update user profile', async () => {
            mockReq.body = updateData;
            const expectedUser = { ...updateData, id: 1 };
            userService.updateUser.mockResolvedValue(expectedUser);

            await userController.updateOwnProfile(mockReq, mockRes);

            expect(userService.updateUser).toHaveBeenCalledWith(1, updateData);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expectedUser);
        });

        it('should return 400 if email already exists', async () => {
            mockReq.body = updateData;
            const error = new Error('Email exists');
            error.name = 'SequelizeUniqueConstraintError';
            userService.updateUser.mockRejectedValue(error);

            await userController.updateOwnProfile(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Email already exists' });
        });
    });

    describe('loginPatient', () => {
        const loginData = {
            email: 'patient@example.com',
            password: 'password123'
        };

        it('should successfully login patient', async () => {
            mockReq.body = loginData;
            const loginResult = { id: 1, token: 'token123' };
            userService.loginUser.mockResolvedValue(loginResult);

            await userController.loginPatient(mockReq, mockRes);

            expect(userService.loginUser).toHaveBeenCalledWith(loginData.email, loginData.password, 'patient');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                patientID: 1,
                token: 'token123',
                message: 'Login successful'
            });
        });

        it('should return 401 for invalid credentials', async () => {
            mockReq.body = loginData;
            userService.loginUser.mockRejectedValue(new Error('Invalid credentials'));

            await userController.loginPatient(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
        });
    });

    describe('loginDoctor', () => {
        const loginData = {
            email: 'doctor@example.com',
            password: 'password123'
        };

        it('should successfully login doctor', async () => {
            mockReq.body = loginData;
            const loginResult = { id: 1, token: 'token123' };
            userService.loginUser.mockResolvedValue(loginResult);

            await userController.loginDoctor(mockReq, mockRes);

            expect(userService.loginUser).toHaveBeenCalledWith(loginData.email, loginData.password, 'doctor');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                doctorID: 1,
                token: 'token123',
                message: 'Login successful'
            });
        });
    });

    describe('loginAdmin', () => {
        const loginData = {
            email: 'admin@example.com',
            password: 'password123'
        };

        it('should successfully login admin', async () => {
            mockReq.body = loginData;
            const loginResult = { id: 1, token: 'token123' };
            userService.loginUser.mockResolvedValue(loginResult);

            await userController.loginAdmin(mockReq, mockRes);

            expect(userService.loginUser).toHaveBeenCalledWith(loginData.email, loginData.password, 'admin');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                adminID: 1,
                token: 'token123',
                message: 'Login successful'
            });
        });
    });
});