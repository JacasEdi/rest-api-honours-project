const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const learnerSchema = new Schema(
{
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    enrolments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Enrolment'
        }
    ],
});

module.exports = mongoose.model('Learner', learnerSchema);
