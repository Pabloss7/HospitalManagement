const express = require('express');
const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Base path for all routes
app.use('/hospitalManagement', require('./routes'));

module.exports = app;