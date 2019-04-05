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
  name: {
    type: String,
    required: false
  },
  table: {
    type: String,
    required: false
  },
  team: {
    type: String,
    required: false
  },
  answered: {
    type: String
  }
});


module.exports = mongoose.model('Question', schema);