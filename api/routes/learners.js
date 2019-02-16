const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const Learner = require('../models/learner');
const { transformLearner } = require('../response-parsers');


// Get single learner
router.get('/:learnerId', async (req, res, next) => {
    try {
        const learner = await Learner.findById(req.params.learnerId)
            .populate({
            path: 'enrolments',
            populate: {
                path: 'course',
                model: 'Course'
            }})
            .select('-__v -password');

        if(learner) {
            res.status(200).json(transformLearner(learner));
        }
        else {
            res.status(404).json({ message: 'Learner not found' })
        }
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});

// Get all learners
router.get('/', async (req, res, next) => {
    try {
        const learners = await Learner.find().populate({
            path: 'enrolments',
            populate: {
                path: 'course',
                model: 'Course'
            }}).select('-__v -password');

        const response = {
            count: learners.length,
            learners: learners.map(learner => {
                return transformLearner(learner);
            })
        };
        res.status(200).json(response);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});

// Create a new learner
router.post('/', async (req, res, next) => {
    try {
        const existingLearner = await Learner.findOne({ email: req.body.email });
        if (existingLearner) res.status(500).json({ message: 'Learner already exists'} );

        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const learner = new Learner({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            age: req.body.age
        });

        const result = await learner.save();
        res.status(201).json({
            createdLearner: {
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                age: result.age,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3100/learners/' + result._id
                }
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});

// Update learner
router.patch('/:learnerId', async (req, res, next) => {
    try {
        const propsToUpdate = {};
        for (const prop of req.body) {
            propsToUpdate[prop.propName] = prop.value;
        }

        await Learner.update(
            { _id: req.params.learnerId },
            { $set: propsToUpdate }
        );

        res.status(200).json({
            message: 'Learner updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3100/learners/' + req.params.learnerId
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});

// Delete learner
router.delete('/:learnerId', async (req, res, next) => {
    try {
        await Learner.deleteOne({ _id: req.params.learnerId });
        res.status(200).json({
            message: 'Learner deleted'
        });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;
