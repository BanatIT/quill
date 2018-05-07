var Team = require('../models/Team');
var User = require('../models/User');
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
  t.owner = userId;

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

TeamController.deleteTeam = function (teamCode, userId, callback){

  this.getByCode(teamCode, function (err, team){
    if (err) { callback(err); }

    if (team.owner !== userId){
      return callback({
        message: "Get outta here, punk!"
      });
    }


    // remove all members from team
    User
      .find({
        teamCode: teamCode
      }).exec(function(err, teammates) {
        if(err) {
          return callback(err);
        }

        teammates.forEach( function (teammate) {
          UserController.leaveTeam(teammate._id, function (err){
            if (err) { return callback(err);}
          });
        } )
    });

    Team.remove({
      _id: teamCode
      }, function (err) {
      if (err) {
        console.error(err);
        return callback(err)
      }

      return callback(null);
    });

  });

};

TeamController.updateTeam = function (teamCode, team, userId, callback){
  this.getByCode(teamCode, function (err, currentTeam){
    if (err) { callback(err); }

    if (currentTeam.owner !== userId){
      return callback({
        message: "Get outta here, punk!"
      });
    }

    console.log(team, teamCode);

    Team.findOneAndUpdate({
      _id: teamCode
    }, {
      $set: {
        'name': team.name,
        'description': team.description,
        'location': team.location
      }
    },{
      new: true
    }, callback)
  });
};

// User.findOneAndUpdate({
//     _id: id,
//     verified: true
//   },
//   {
//     $set: {
//       'lastUpdated': Date.now(),
//       'profile': profile,
//       'status.completedProfile': true
//     }
//   },
//   {
//     new: true
//   },
//   callback);

module.exports = TeamController;
