const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const Learner = require('../models/learner');
const Enrolment = require('../models/enrolment');
const { transformLearner } = require('../response-parsers')


// Get single learner
router.get('/:learnerId', async (req, res, next) => {
    try {
        const learner = await Learner.findById(req.params.learnerId).populate({
            path: 'enrolments',
            populate: {
                path: 'course',
                model: 'Course'
            }
        }).select('-__v -password');

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
            }
        }).select('-__v -password');
        const response = {
            count: learners.length,
            learners: learners.map(learner => {
                return {
                    ...learner._doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3100/learners/' + learner._id
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
        const existingLearner = await Learner.findOne({ email: req.body.email });
        if (existingLearner)
        {
            res.status(500).json({ message: 'Learner already exists'} );
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        const learner = new Learner({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            age: req.body.age
        });
        const result = await learner.save();
        console.log(result);

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
        console.log(err);
        res.status(500).json({ error: err });
    }
});

router.patch('/:learnerId', (req, res, next) => {
    res.status(200).json({
        message: 'updated learner'
    });
});

router.delete('/:learnerId', (req, res, next) => {
    res.status(200).json({
        message: 'deleted learner'
    });
});

module.exports = router;
