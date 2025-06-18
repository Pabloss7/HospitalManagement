// const request = require('supertest');
// const app = require('../../app');
// const { User, Appointment, Availability } = require('../../models');

// describe('Appointment Management Flow', () => {
//     beforeEach(async () => {
//         // Clear relevant tables before each test
//         await Appointment.destroy({ where: {} });
//         await Availability.destroy({ where: {} });
//         await User.destroy({ where: {} });
//     });

//     describe('Appointment Booking', () => {
//         const doctorData = {
//             name: 'Dr. Smith',
//             email: 'dr.smith@hospital.com',
//             password: 'password123',
//             department: 'Cardiology',
//             age: 35,
//             gender: 'female',
//             phone: '0987654321',
//             address: '456 Hospital St'
//         };

//         const patientData = {
//             name: 'John Patient',
//             email: 'john.patient@example.com',
//             password: 'password123',
//             age: 30,
//             gender: 'male',
//             phone: '1234567890',
//             address: '123 Main St'
//         };

//         test('Should book an appointment successfully', async () => {
//             // Create department first
//             await request(app)
//                 .post('/hospitalManagement/departments')
//                 .send({ name: 'Cardiology' });

//             // Register doctor
//             const doctorResponse = await request(app)
//                 .post('/hospitalManagement/doctors')
//                 .send(doctorData);

//             // Register patient
//             const patientResponse = await request(app)
//                 .post('/hospitalManagement/patients')
//                 .send(patientData);

//             // Login as doctor to create availability
//             const doctorLogin = await request(app)
//                 .post('/hospitalManagement/doctors/login')
//                 .send({
//                     email: doctorData.email,
//                     password: doctorData.password
//                 });

//             // Create availability slot
//             const availabilityData = {
//                 Date: '2024-02-01',
//                 startTime: '10:00',
//                 endTime: '11:00'
//             };

//             const availabilityResponse = await request(app)
//                 .post('/hospitalManagement/doctors/availability')
//                 .set('Authorization', `Bearer ${doctorLogin.body.token}`)
//                 .send(availabilityData)
//                 .expect(201);

//             // Login as patient to book appointment
//             const patientLogin = await request(app)
//                 .post('/hospitalManagement/patients/login')
//                 .send({
//                     email: patientData.email,
//                     password: patientData.password
//                 });

//             // Book the appointment
//             const response = await request(app)
//                 .post('/hospitalManagement/appointments')
//                 .set('Authorization', `Bearer ${patientLogin.body.token}`)
//                 .send({
//                     doctorId: doctorResponse.body.id,
//                     availabilityId: availabilityResponse.body.id
//                 })
//                 .expect(201);

//             expect(response.body).toHaveProperty('id');
//             expect(response.body.status).toBe('pending');
//             expect(response.body.patientId).toBe(patientResponse.body.id);
//             expect(response.body.doctorId).toBe(doctorResponse.body.id);
//         });

//         test('Should not book appointment with unavailable time slot', async () => {
//             // Setup similar to previous test...
//             // ... (doctor registration, patient registration, availability creation)

//             // Try to book the same slot twice
//             const response = await request(app)
//                 .post('/hospitalManagement/appointments')
//                 .set('Authorization', `Bearer ${patientLogin.body.token}`)
//                 .send({
//                     doctorId: doctorResponse.body.id,
//                     availabilityId: availabilityResponse.body.id
//                 })
//                 .expect(400);

//             expect(response.body).toHaveProperty('error');
//             expect(response.body.error).toContain('Time slot is not available');
//         });

//         test('Should cancel appointment successfully', async () => {
//             // Create appointment first...
//             // ... (similar setup to booking test)

//             const response = await request(app)
//                 .put(`/hospitalManagement/appointments/${appointmentId}/cancel`)
//                 .set('Authorization', `Bearer ${patientLogin.body.token}`)
//                 .expect(200);

//             expect(response.body.status).toBe('cancelled');
            
//             // Verify the time slot is available again
//             const availability = await Availability.findByPk(availabilityId);
//             expect(availability.isAvailable).toBe(true);
//         });
//     });
// });