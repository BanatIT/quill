var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  value: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  answered: {
    type: String
  }
});


module.exports = mongoose.model('Question', schema);