const moment = require('moment');

exports.parseDate = date => moment(date).format('MMMM Do YYYY, h:mm:ss a');
