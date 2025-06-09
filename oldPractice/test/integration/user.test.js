const request = require('supertest');
const app = require('../../src/app');

describe('User Endpoints', () => {
    it('should create a new user', async () => {
        const res = await request(app)
            .post('/users')
            .set('Authorization', 'Bearer testadmintoken')
            .send({ username: 'newuser', password: 'password123', role: 'patient' });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
    });

    it('should get a user by ID', async () => {
        const res = await request(app)
            .get('/users/1')
            .set('Authorization', 'Bearer testadmintoken');
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('user');
    });

    it('should fail to update a user without required fields', async () => {
        const res = await request(app)
            .put('/users/1')
            .set('Authorization', 'Bearer testadmintoken')
            .send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Bad request');
    });
});
