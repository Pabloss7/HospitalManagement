const request = require('supertest');
const app = require('../../src/app');

describe('Appointment Endpoints', () => {
    it('should create a new appointment', async () => {
        const res = await request(app)
            .post('/appointments')
            .set('Authorization', 'Bearer testpatienttoken')
            .send({ doctor_id: 1, date: '2025-01-15', time: '10:00' });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
    });

    it('should fail to create an appointment with conflicting time', async () => {
        await request(app)
            .post('/appointments')
            .set('Authorization', 'Bearer testpatienttoken')
            .send({ doctor_id: 1, date: '2025-01-15', time: '10:00' });

        const res = await request(app)
            .post('/appointments')
            .set('Authorization', 'Bearer testpatienttoken')
            .send({ doctor_id: 1, date: '2025-01-15', time: '10:00' });
        expect(res.statusCode).toEqual(400);
    });
});
