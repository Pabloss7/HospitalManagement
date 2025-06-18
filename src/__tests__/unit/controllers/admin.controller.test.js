const { User, Department, Log } = require('../../../models');
const { modifyDoctorInfo, modifyPatientInfo, getAllPatients, getAllLogs } = require('../../../controllers/admin.controller');

// Mock the models
jest.mock('../../../models', () => ({
    User: {
        findOne: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn()
    },
    Department: {
        findByPk: jest.fn()
    },
    Log: {
        findAll: jest.fn()
    }
}));

// Mock request and response
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Admin Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {},
            body: {}
        };
        res = mockResponse();
        jest.clearAllMocks();
    });

    describe('modifyDoctorInfo', () => {
        it('should successfully modify doctor information', async () => {
            const mockDoctor = {
                id: 1,
                role: 'doctor',
                update: jest.fn(),
                setDepartments: jest.fn()
            };
            const mockDepartment = { id: 1, name: 'Cardiology' };
            
            req.params = { doctorId: 1 };
            req.body = { name: 'Dr. Smith', departmentId: 1 };
            
            User.findOne
                .mockResolvedValueOnce(mockDoctor)
                .mockResolvedValueOnce({ ...mockDoctor, name: 'Dr. Smith' });
            Department.findByPk.mockResolvedValue(mockDepartment);

            await modifyDoctorInfo(req, res);

            expect(User.findOne).toHaveBeenCalledTimes(2);
            expect(mockDoctor.update).toHaveBeenCalledWith({ name: 'Dr. Smith' });
            expect(mockDoctor.setDepartments).toHaveBeenCalledWith([mockDepartment]);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 if doctor not found', async () => {
            req.params = { doctorId: 999 };
            User.findOne.mockResolvedValue(null);

            await modifyDoctorInfo(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Doctor not found' });
        });
    });

    describe('modifyPatientInfo', () => {
        it('should successfully modify patient information', async () => {
            const mockPatient = {
                id: 1,
                update: jest.fn().mockResolvedValue({ id: 1, name: 'John Updated' })
            };
            
            req.params = { patientID: 1 };
            req.body = { name: 'John Updated' };
            
            User.findByPk.mockResolvedValue(mockPatient);

            await modifyPatientInfo(req, res);

            expect(mockPatient.update).toHaveBeenCalledWith({ name: 'John Updated' });
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 if patient not found', async () => {
            req.params = { patientID: 999 };
            User.findByPk.mockResolvedValue(null);

            await modifyPatientInfo(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Patient not found' });
        });
    });

    describe('getAllPatients', () => {
        it('should return all patients', async () => {
            const mockPatients = [
                { name: 'John', email: 'john@example.com', phone: '1234567890', address: '123 St' }
            ];
            
            User.findAll.mockResolvedValue(mockPatients);

            await getAllPatients(req, res);

            expect(User.findAll).toHaveBeenCalledWith({
                where: { role: 'patient' },
                attributes: ['name', 'email', 'phone', 'address']
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockPatients);
        });

        it('should handle errors', async () => {
            User.findAll.mockRejectedValue(new Error('Database error'));

            await getAllPatients(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });

    describe('getAllLogs', () => {
        it('should return all logs with user information', async () => {
            const mockLogs = [
                { 
                    id: 1, 
                    timestamp: new Date(),
                    user: { name: 'John', email: 'john@example.com', role: 'patient' }
                }
            ];
            
            Log.findAll.mockResolvedValue(mockLogs);

            await getAllLogs(req, res);

            expect(Log.findAll).toHaveBeenCalledWith({
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email', 'role']
                }],
                order: [['timestamp', 'DESC']]
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockLogs);
        });

        it('should handle errors', async () => {
            Log.findAll.mockRejectedValue(new Error('Database error'));

            await getAllLogs(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Internal server error',
                error: 'Database error'
            });
        });
    });
});