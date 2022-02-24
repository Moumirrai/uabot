const { Schema, model } = require('mongoose');
const data = Schema({
    ID: {
        type: String,
        default: "news"
    },
    data: {
        type: Array,
        default: []
    },
}, { collection: 'data' });

module.exports = model('data', data);
data.set('autoIndex', false);