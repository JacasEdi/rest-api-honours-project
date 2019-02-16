const express = require('express');
const router = express.Router();

const Enrolment = require('../models/enrolment');
const Course = require('../models/course');
const Learner = require('../models/learner');
const { transformEnrolment, transformCourse, transformLearner } = require('../response-parsers');


// Get single enrolment
router.get('/:enrolmentId', async (req, res, next) => {
    try {
        const enrolment = await Enrolment.findById(req.params.enrolmentId)
            .populate([{path: 'learner'}, {path: 'course'}])
            .select('-__v');

        if(enrolment) {
            res.status(200).json(transformEnrolment(enrolment));
        }
        else {
            res.status(404).json({ message: 'Enrolment not found' })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

// Get all enrolments
router.get('/', async (req, res, next) => {
    try {
        const enrolments = await Enrolment.find().populate([{path: 'learner'}, {path: 'course'}]).select('-__v');
        const response = {
            count: enrolments.length,
            enrolments: enrolments.map(enrolment => {
                return transformEnrolment(enrolment);
            })
        };
        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

// Create a new enrolment
router.post('/', async (req, res, next) => {
    try {
        const fetchedCourse = await Course.findById(req.body.courseId);
        const fetchedLearner = await Learner.findById(req.body.learnerId);

        if(fetchedCourse && fetchedLearner) {
            const enrolment = new Enrolment({
                course: fetchedCourse,
                learner: fetchedLearner,
                progress: req.body.progress,
            });

            const result = await enrolment.save();
            await Learner.update({ _id: fetchedLearner._id }, { $push: { enrolments: result._id } });

            res.status(201).json({
                createdEnrolment: {
                    _id: result._id,
                    course: transformCourse(result.course),
                    learner: transformLearner(result.learner),
                    progress: result.progress,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3100/enrolments/' + result._id
                    }
                }
            });
        }
        else {
            res.status(500).json({
                message: 'Course and/or Learner not found'
            });
        }
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});

// Update enrolment
router.patch('/:enrolmentId', async (req, res, next) => {
    try {
        const propsToUpdate = {};
        for (const prop of req.body) {
            propsToUpdate[prop.propName] = prop.value;
        }

        await Enrolment.update(
            { _id: req.params.enrolmentId },
            { $set: propsToUpdate }
        );

        res.status(200).json({
            message: 'Enrolment updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3100/enrolments/' + req.params.enrolmentId
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});

// Delete enrolment
router.delete('/:enrolmentId', async (req, res, next) => {
    try {
        const enrolment = await Enrolment.findById(req.params.enrolmentId);
        await Enrolment.deleteOne({ _id: req.params.enrolmentId });
        await Learner.update({ _id: enrolment.learner }, { $pull: { enrolments: enrolment._id } });

        res.status(200).json({
            message: 'Enrolment cancelled successfully.'
        });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;
