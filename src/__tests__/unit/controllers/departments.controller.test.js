const departmentController = require('../../../controllers/departments.controller');
const departmentService = require('../../../services/department.service');

// Mock the department service
jest.mock('../../../services/department.service');

describe('Department Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    describe('createDepartment', () => {
        it('should successfully create a department', async () => {
            const mockDepartment = { id: 1, name: 'Cardiology' };
            req.body = { name: 'Cardiology' };
            
            departmentService.createDepartment.mockResolvedValue(mockDepartment);

            await departmentController.createDepartment(req, res);

            expect(departmentService.createDepartment).toHaveBeenCalledWith({ name: 'Cardiology' });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockDepartment);
        });

        it('should handle duplicate department error', async () => {
            req.body = { name: 'Cardiology' };
            const error = new Error('Department already exists');
            error.name = 'SequelizeUniqueConstraintError';
            
            departmentService.createDepartment.mockRejectedValue(error);

            await departmentController.createDepartment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Department already exists' });
        });

        it('should handle internal server error', async () => {
            req.body = { name: 'Cardiology' };
            departmentService.createDepartment.mockRejectedValue(new Error('Database error'));

            await departmentController.createDepartment(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error creating department',
                error: 'Database error'
            });
        });
    });

    describe('getAllDepartments', () => {
        it('should successfully get all departments', async () => {
            const mockDepartments = [
                { id: 1, name: 'Cardiology' },
                { id: 2, name: 'Neurology' }
            ];
            
            departmentService.getAllDepartments.mockResolvedValue(mockDepartments);

            await departmentController.getAllDepartments(req, res);

            expect(departmentService.getAllDepartments).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockDepartments);
        });

        it('should handle internal server error', async () => {
            departmentService.getAllDepartments.mockRejectedValue(new Error('Database error'));

            await departmentController.getAllDepartments(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });

    describe('deleteDepartment', () => {
        it('should successfully delete a department', async () => {
            req.params = { departmentId: 1 };
            const mockResult = { message: 'Department deleted successfully' };
            
            departmentService.deleteDepartment.mockResolvedValue(mockResult);

            await departmentController.deleteDepartment(req, res);

            expect(departmentService.deleteDepartment).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should handle custom error status', async () => {
            req.params = { departmentId: 999 };
            const error = new Error('Department not found');
            error.status = 404;
            
            departmentService.deleteDepartment.mockRejectedValue(error);

            await departmentController.deleteDepartment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Department not found' });
        });

        it('should handle internal server error', async () => {
            req.params = { departmentId: 1 };
            departmentService.deleteDepartment.mockRejectedValue(new Error('Database error'));

            await departmentController.deleteDepartment(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });
});