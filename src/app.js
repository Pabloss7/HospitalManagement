const express = require('express');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const medicalRecordRoutes = require('./routes/medicalRecord.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const publicRoutes = require('./routes/public.routes');

const app = express();

app.use(express.json());

app.use('/users',userRoutes);
app.use('/auth',authRoutes);
app.use('/medicalRecord', medicalRecordRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/public', publicRoutes);

app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;