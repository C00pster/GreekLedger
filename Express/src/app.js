const express = require('express');
const mongoose = require('mongoose');

// Set up express
const app = express();
const port = 3000;

// Set up authentication
require('dotenv').config();

// Import routes
const helloRouter  = require('./routes/hello_route');
const memberRoutes = require('./routes/member_routes');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/test')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error("Could not connect to MongoDB", err));

// Set up express to parse request body
app.use(express.json());

// Set up routes
app.use('/hello', helloRouter);
app.use('/members', memberRoutes);


module.exports = app;