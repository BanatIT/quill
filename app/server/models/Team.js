var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    // code: {
    //     type: String,
    //     min: 0,
    //     max: 140,
    //     unique: true,
    //     required: true
    // },
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