const express = require('express');
const cors = require('cors');

// const routes = require('./routes');
const deviceRoutes = require('./routes/device.routes.js')

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', deviceRoutes);

module.exports = app;