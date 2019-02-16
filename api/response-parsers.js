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
        course: transformCourse(enrolment.course),
        createdAt: parseDate(enrolment.createdAt),
        updatedAt: parseDate(enrolment.updatedAt),
        request: {
            type: 'GET',
            url: 'http://localhost:3100/enrolments/' + enrolment._id
        }
    };
};

const transformEnrolments = enrolments => {
    return enrolments.map(enrolment => {
        return transformEnrolment(enrolment);
    });
};

const transformLearner = learner => {
    return {
        ...learner._doc,
        password: null,
        enrolments: transformEnrolments(learner.enrolments),
        request: {
            type: 'GET',
            url: 'http://localhost:3100/learners/' + learner._id
        }
    };
};

exports.transformCourse = transformCourse;
exports.transformLearner = transformLearner;
exports.transformEnrolment = transformEnrolment;
