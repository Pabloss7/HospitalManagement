const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bienvenido al sistema de gestión de citas y registros médicos.');
  });

module.exports = app;