var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {
        type: String,
      required: true,
      unique: true,
    },
    location: {
        type: String
    },
    description: {
        type: String
    },
    votes: {
        type: Number,
        default: 0
    },
    gavelScore: {
        type: Number,
        default: 0
    },
    owner: {
        type: String,
        required: true
    },
    totalScore: {
        type: Number,
        default: 0,
        required: false
    }

});

schema.static.findByName = function (name) {
    return this.find({
        name: name.toLowerCase()
    });
};

// schema.static.findByCode = function(code) {
//     return this.find({
//       code: code
//     });
// };

module.exports = mongoose.model('Team', schema);