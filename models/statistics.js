const { Schema, model } = require('mongoose');
const statistics = Schema({
    ID: {
        type: String,
        default: "statistics"
    },
    data: {
        checks: {
            type: Number,
            default: 0
        },
        newFound: {
            type: Number,
            default: 0
        },
        messagesSent: {
            type: Number,
            default: 0
        },
    },
}, { collection: 'statistics' });

module.exports = model('statistics', statistics);
statistics.set('autoIndex', false);