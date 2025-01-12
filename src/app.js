const express = require('express');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const medicalRecordRoutes = require('./routes/medicalRecord.routes');

const app = express();

app.use(express.json());
app.use('/users',userRoutes);
app.use('/auth',authRoutes);
app.use('/medicalRecord', medicalRecordRoutes);

app.get('/', (req, res) => {
    res.send('Bienvenido al sistema de gestión de citas y registros médicos.');
  });

module.exports = app;