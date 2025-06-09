const request = require('supertest');
const app = require('../../src/app');

describe('Medical Record Endpoints', () => {
    it('should create a new medical record', async () => {
        const res = await request(app)
            .post('/medicalRecord')
            .set('Authorization', 'Bearer testdoctortoken')
            .send({
                patient_id: 1,
                diagnosis: 'Flu',
                prescriptions: ['Medicine A'],
                notes: 'Patient has a fever',
                test_results: [{ test_type: 'Blood Test', result: 'Normal' }],
                treatments: [{ treatment_type: 'Rest', details: 'Bed rest for 3 days' }],
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
    });

    it('should fail to create a medical record with missing fields', async () => {
        const res = await request(app)
            .post('/medicalRecord')
            .set('Authorization', 'Bearer testdoctortoken')
            .send({ patient_id: 1, diagnosis: 'Flu' });
        expect(res.statusCode).toEqual(400);
    });

    it('should return empty array for patient with no records', async () => {
        const res = await request(app)
            .get('/medicalRecord')
            .set('Authorization', 'Bearer testpatienttoken');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });
});
