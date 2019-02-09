const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const enrolmentSchema = new Schema(
    {
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course'
        },
        learner: {
            type: Schema.Types.ObjectId,
            ref: 'Learner'
        },
        progress: {
            type: Number,
            default: 0
        }
    }, 
    { timestamps: true }
);

module.exports = mongoose.model('Enrolment', enrolmentSchema);
