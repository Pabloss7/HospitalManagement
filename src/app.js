require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

app.use('/hospitalManagement', require('./routes'));

module.exports = app;