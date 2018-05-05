var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    description: {
        type: String
    },
    timestamp: {
        type: Number,
        required: true,
        default: Date.now()
    }
});

module.exports = mongoose.model('Notification', schema);