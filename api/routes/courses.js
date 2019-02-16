const express = require('express');
const router = express.Router();

const Course = require('../models/course');
const { transformCourse } = require('../response-parsers');


// Get single course
router.get('/:courseId', async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.courseId).select('-__v');

        if(course) {
            res.status(200).json(transformCourse(course));
        }
        else {
            res.status(404).json({ message: 'Course not found' })
        }
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});

// Get all courses
router.get('/', async (req, res, next) => {
    try {
        const courses = await Course.find().select('-__v');
        const response = {
            count: courses.length,
            courses: courses.map(course => {
                return transformCourse(course);
            })
        };
        res.status(200).json(response);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});

// Create a new course
router.post('/', async (req, res, next) => {
    try {
        const course = new Course({
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            location: req.body.location
        });
        const result = await course.save();

        res.status(201).json({
            createdCourse: {
                _id: result._id,
                title: result.title,
                description: result.description,
                date: result.date,
                location: result.location,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3100/courses/' + result._id
                }
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});

// Update course
router.patch('/:courseId', async (req, res, next) => {
    try {
        const propsToUpdate = {};
        for (const prop of req.body) {
            propsToUpdate[prop.propName] = prop.value;
        }

        await Course.update(
            { _id: req.params.courseId },
            { $set: propsToUpdate }
        );

        res.status(200).json({
            message: 'Course updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3100/courses/' + req.params.courseId
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});

// Delete course
router.delete('/:courseId', async (req, res, next) => {
    try {
        await Course.deleteOne({ _id: req.params.courseId });
        res.status(200).json({
            message: 'Course deleted'
        });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;
