const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const csurf = require('csurf');

// Set up authentication
require('dotenv').config();

// Import routes
const helloRouter  = require('./routes/hello_route');
const userRoutes = require('./routes/user_routes');
const greekOrgRoutes = require('./routes/greek_org_routes');
const greekChapterRoutes = require('./routes/greek_chapter_routes');

// Import middleware
const { addCredentials } = require('./middleware/auth_middleware');

// Set up express
const app = express();
app.use(helmet());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/test')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error("Could not connect to MongoDB", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(csurf({ cookie: true }));

// Set up routes
app.use('/api/hello', helloRouter);
app.use('/api/user', userRoutes);
app.use('/api/greekorg', addCredentials, greekOrgRoutes); 
app.use('/api/greekchapter', addCredentials, greekChapterRoutes);

// Set up port and start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = app;