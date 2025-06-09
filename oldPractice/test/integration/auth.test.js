const request = require('supertest');
const app = require('../../src/app');

describe('Auth Endpoints', () => {
    it('should login successfully', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'testuser', password: 'testpassword' });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should fail to login with invalid credentials', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'wronguser', password: 'wrongpassword' });
        expect(res.statusCode).toEqual(401);
    });

    it('should reject requests with invalid token', async () => {
        const res = await request(app)
            .get('/users')
            .set('Authorization', 'Bearer invalidtoken');
        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toEqual('Invalid token');
    });
});
