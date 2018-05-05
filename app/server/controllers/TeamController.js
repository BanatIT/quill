var Team = require('../models/Team');
var UserController = require('./UserController');

var TeamController = {};

TeamController.getTeams = function (callback){
  Team.find({}, callback);
};

TeamController.getByCode = function (code, callback) {
  Team.findById(code).exec(callback);
};

TeamController.createTeam = function(team, userId, callback) {
  var t = new Team();
  t.name = team.name;
  t.location = team.location;
  t.description = team.description;

  t.save(function(err){
    if (err) {
      // Duplicate key error codes
      if (err.name === 'MongoError' && (err.code === 11000 || err.code === 11001)) {
        return callback({
          message: 'This team already exists.'
        });
      }
      return callback(err);
    } else {
      console.log('teamcontroller:create',t);
      console.warn(typeof t._id, t._id);
      UserController.createOrJoinTeam(userId, t._id.toString(), function(err, data) {
        if (err) {
          return callback(err);
        } else {
         return callback(null, {team:t});
        }
      });
    }
  })

};

module.exports = TeamController;
