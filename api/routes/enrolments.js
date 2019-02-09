const express = require('express');
const router = express.Router();

const Enrolment = require('../models/enrolment');
const Course = require('../models/course');
const Learner = require('../models/learner');



router.get('/', async (req, res, next) => {
    try {
        const enrolments = await Enrolment.find().select('-__v');
        const response = {
            count: enrolments.length,
            enrolments: enrolments.map(enrolment => {
                console.log(enrolment);
                return {
                    ...enrolment._doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3100/enrolments/' + enrolment._id
                    }
                }
            })
        };
        console.log(response);
        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

router.post('/', async (req, res, next) => {
    try {
        const fetchedCourse = await Course.findById(req.body.courseId);
        const fetchedLearner = await Learner.findById(req.body.learnerId);

        if(fetchedCourse && fetchedLearner) {
            const enrolment = new Enrolment({
                course: req.body.courseId,
                learner: req.body.learnerId,
                progress: req.body.progress,
            });
            const result = await enrolment.save();
            console.log(result);

            res.status(201).json({
                createdEnrolment: {
                    _id: result._id,
                    course: result.course,
                    learner: result.learner,
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
        console.log(err);
        res.status(500).json({ error: err });
    }
});

router.get('/:enrolmentId', async (req, res, next) => {
    try {
        const enrolment = await Enrolment.findById(req.params.enrolmentId).select('-__v');

        if(enrolment) {
            res.status(200).json(enrolment._doc);
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

router.patch('/:enrolmentId', async (req, res, next) => {
    try {
        const propsToUpdate = {};
        for (const prop of req.body) {
            propsToUpdate[prop.propName] = prop.value;
        }

        const result = await Enrolment.update(
            { _id: req.params.enrolmentId },
            { $set: propsToUpdate }
        );

        console.log(result);
        res.status(200).json({
            message: 'Enrolment updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3100/enrolments/' + req.params.enrolmentId
            }
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

router.delete('/:enrolmentId', async (req, res, next) => {
    try {
        const result = await Enrolment.deleteOne({ _id: req.params.enrolmentId });
        res.status(200).json({
            message: 'Enrolment deleted'
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

module.exports = router;
