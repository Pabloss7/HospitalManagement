// const request = require('supertest');
// const app = require('../../app');
// const { User } = require('../../models');

// describe('Authentication Flow', () => {
//     beforeEach(async () => {
//         await User.destroy({ where: {} }); // Clear users before each test
//     });

//     describe('Patient Registration and Login', () => {
//         const patientData = {
//             name: 'John Doe',
//             email: 'john.doe@example.com',
//             password: 'password123',
//             age: 30,
//             gender: 'male',
//             phone: '1234567890',
//             address: '123 Main St'
//         };
     
//         test('Should register a new patient', async () => {
//             const response = await request(app)
//                 .post('/hospitalManagement/patients')
//                 .send(patientData)
//                 .expect(201);

//             expect(response.body).toHaveProperty('id');
//             expect(response.body.email).toBe(patientData.email);
//             expect(response.body.role).toBe('patient');
//         });

//         test('Should login a patient', async () => {
//             // First register the patient
//             await request(app)
//                 .post('/hospitalManagement/patients')
//                 .send(patientData);

//             // Then try to login
//             const response = await request(app)
//                 .post('/hospitalManagement/patients/login')
//                 .send({
//                     email: patientData.email,
//                     password: patientData.password
//                 })
//                 .expect(200);

//             expect(response.body).toHaveProperty('token');
//             expect(response.body).toHaveProperty('patientID');
//             expect(response.body.message).toBe('Login successful');
//         });
//     });

//     describe('Doctor Registration and Login', () => {
//         const doctorData = {
//             name: 'Jane Smith',
//             email: 'jane.smith@hospital.com',
//             password: 'password123',
//             department: 'Cardiology', // Required field
//             age: 35,
//             gender: 'female',
//             phone: '0987654321',
//             address: '456 Hospital St'
//         };

//         test('Should register a new doctor', async () => {
//             // First create a department
//             await request(app)
//                 .post('/hospitalManagement/departments')
//                 .send({ name: 'Cardiology' });

//             const response = await request(app)
//                 .post('/hospitalManagement/doctors')
//                 .send(doctorData)
//                 .expect(201);

//             expect(response.body).toHaveProperty('id');
//             expect(response.body.email).toBe(doctorData.email);
//             expect(response.body.role).toBe('doctor');
//         });

//         test('Should login a doctor', async () => {
//             // First create a department
//             await request(app)
//                 .post('/hospitalManagement/departments')
//                 .send({ name: 'Cardiology' });

//             // Then register the doctor
//             await request(app)
//                 .post('/hospitalManagement/doctors')
//                 .send(doctorData);

//             // Finally try to login
//             const response = await request(app)
//                 .post('/hospitalManagement/doctors/login')
//                 .send({
//                     email: doctorData.email,
//                     password: doctorData.password
//                 })
//                 .expect(200);

//             expect(response.body).toHaveProperty('token');
//             expect(response.body).toHaveProperty('doctorID');
//             expect(response.body.message).toBe('Login successful');
//         });
//     });

//     describe('Profile Update', () => {
//         test('Should update patient profile with valid token', async () => {
//             // First register and login a patient
//             const patientData = {
//                 name: 'John Update',
//                 email: 'john.update@example.com',
//                 password: 'password123',
//                 age: 30,
//                 gender: 'male',
//                 phone: '1234567890',    // Exactly 10 characters
//                 address: '123 Main Street, Apt 4B'  // Between 10-100 characters
//             };

//             // Register the patient
//             await request(app)
//                 .post('/hospitalManagement/patients')
//                 .send(patientData)
//                 .expect(201);

//             // Login the patient
//             const loginResponse = await request(app)
//                 .post('/hospitalManagement/patients/login')
//                 .send({
//                     email: patientData.email,
//                     password: patientData.password
//                 })
//                 .expect(200);

//             const { token, patientID } = loginResponse.body;  // Correct property names

//             const updateData = {
//                 name: 'John Updated',
//                 phone: '9876543210',    // Exactly 10 characters
//                 address: '456 New Street, Suite 100'  // Between 10-100 characters
//             };

//             // Make the update request
//             const response = await request(app)
//                 .put(`/hospitalManagement/patients/${patientID}`)
//                 .set('Authorization', `Bearer ${token}`)
//                 .send(updateData)
//                 .expect(200);

//             expect(response.body.phone).toBe(updateData.phone);
//             expect(response.body.address).toBe(updateData.address);
//             expect(response.body.name).toBe(updateData.name);
//         });
//     });
// });