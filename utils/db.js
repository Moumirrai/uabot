const db = require('../models/data');

function readData(id) {
    return new Promise(function(resolve, reject) {
        db.findOne({ID: id}, function(err, data) {
            if(err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

function writeData(id, data) {
    return new Promise(function(resolve, reject) {
        db.findOne({ ID: id }, (err, response) => {
            if (err) return console.log(err);
            if (!response) {
                response = new db({
                    ID: id,
                    data: data
                });
                response.save().catch(err => console.log(err));
                resolve(response);
            } else {
                response.data = data
                response.save().catch(err => console.log(err));
                resolve(response);
            }
        });
    });
}

module.exports = {
    readData,
    writeData
}

