const { parseDate } = require('./helpers/date');


const transformCourse = course => {
    return {
        ...course._doc,
        date: parseDate(course.date),
        request: {
            type: 'GET',
            url: 'http://localhost:3100/courses/' + course._id
        }
    };
};

const transformEnrolment = enrolment => {
    return {
        ...enrolment._doc,
        id: enrolment.id,
        createdAt: parseDate(enrolment.createdAt),
        updatedAt: parseDate(enrolment.updatedAt)
    };
};

const transformEnrolments = enrolments => {
    return enrolments.map(enrolment => {
        return {
            ...enrolment._doc,
            id: enrolment.id,
            createdAt: parseDate(enrolment.createdAt),
            updatedAt: parseDate(enrolment.updatedAt)
        };
    });
};

const transformLearner = learner => {
    return {
        ...learner._doc,
        enrolments: transformEnrolments(learner.enrolments),
    };
};

exports.transformCourse = transformCourse;
exports.transformLearner = transformLearner;
exports.transformEnrolment = transformEnrolment;
