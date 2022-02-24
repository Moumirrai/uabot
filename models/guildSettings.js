const { Schema, model } = require('mongoose');

const guildSettings = Schema({
    guildID: String,
    statusChannelName: {
        type: String,
        default: undefined
    },
    statusChannelId: {
        type: String,
        default: undefined
    },
});

module.exports = model('guildSettings', guildSettings);
guildSettings.set('autoIndex', false);