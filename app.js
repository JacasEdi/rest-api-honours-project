const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const courseRoutes = require('./api/routes/courses');
const learnerRoutes = require('./api/routes/learners');
const enrolmentRoutes = require('./api/routes/enrolments');

mongoose.connect(`mongodb+srv://jacas:w97LPKw77AgP2Usj@cluster0-vvdc2.mongodb.net/honours-project?retryWrites=true`);

app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers', '*');

   if(req.method === 'OPTIONS') {
       res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
       return res.status(200).json({});
   }

   next();
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/courses', courseRoutes);
app.use('/learners', learnerRoutes);
app.use('/enrolments', enrolmentRoutes);

app.use((req, res, next) => {
   const error = new Error('Not Found');
   error.status = 404;
   next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;