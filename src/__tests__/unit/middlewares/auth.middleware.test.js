const jwt = require('jsonwebtoken');
const { verifyToken, checkRole } = require('../../../middlewares/auth.middleware');

// Mock jwt module
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
    let mockReq;
    let mockRes;
    let nextFunction;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        
        // Setup request mock
        mockReq = {
            headers: {},
            user: {}
        };

        // Setup response mock
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        // Setup next function
        nextFunction = jest.fn();

        // Mock process.env
        process.env.JWT_SECRET = 'test-secret';
    });

    describe('verifyToken', () => {
        it('should return 403 if no token is provided', () => {
            verifyToken(mockReq, mockRes, nextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'No token provided' });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should return 401 if token is invalid', () => {
            mockReq.headers['authorization'] = 'Bearer invalid-token';
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            verifyToken(mockReq, mockRes, nextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid token' });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should call next() and set user if token is valid', () => {
            const mockDecodedToken = { id: 1, role: 'admin' };
            mockReq.headers['authorization'] = 'Bearer valid-token';
            jwt.verify.mockReturnValue(mockDecodedToken);

            verifyToken(mockReq, mockRes, nextFunction);

            expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
            expect(mockReq.user).toEqual(mockDecodedToken);
            expect(nextFunction).toHaveBeenCalled();
        });
    });

    describe('checkRole', () => {
        beforeEach(() => {
            mockReq.user = { role: 'user' };
        });

        it('should return 403 if user role is not in allowed roles', () => {
            const checkRoleMiddleware = checkRole(['admin']);
            checkRoleMiddleware(mockReq, mockRes, nextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Access denied: insufficient permissions'
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should call next() if user role is in allowed roles', () => {
            mockReq.user.role = 'admin';
            const checkRoleMiddleware = checkRole(['admin', 'user']);
            checkRoleMiddleware(mockReq, mockRes, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
        });
    });
});