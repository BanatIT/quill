var Team = require('../models/Team');
var User = require('../models/User');
var Settings = require('../models/Settings');
var UserController = require('./UserController');

var TeamController = {};


function sortTeamsByScoreDescending(a, b) {
    if (a.gavelScore > b.gavelScore)
        return -1;
    if (a.gavelScore < b.gavelScore)
        return 1;
    return 0;
}

TeamController.getTeams = function (callback) {
    Team.find({}, callback);
};

TeamController.getByCode = function (code, callback) {
    Team.findById(code).exec(callback);
};

TeamController.createTeam = function (team, userId, callback) {
    var t = new Team();
    t.name = team.name;
    t.location = team.location;
    t.description = team.description;
    t.owner = userId;

    t.save(function (err) {
        if (err) {
            // Duplicate key error codes
            if (err.name === 'MongoError' && (err.code === 11000 || err.code === 11001)) {
                return callback({
                    message: 'This team already exists.'
                });
            }
            return callback(err);
        } else {
            console.log('teamcontroller:create', t);
            console.warn(typeof t._id, t._id);
            UserController.createOrJoinTeam(userId, t._id.toString(), function (err, data) {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, {team: t});
                }
            });
        }
    })

};

TeamController.deleteTeam = function (teamCode, userId, callback) {

    this.getByCode(teamCode, function (err, team) {
        if (err) {
            callback(err);
        }

        if (team.owner !== userId) {
            return callback({
                message: "Get outta here, punk!"
            });
        }


        // remove all members from team
        User
            .find({
                teamCode: teamCode
            }).exec(function (err, teammates) {
            if (err) {
                return callback(err);
            }

            teammates.forEach(function (teammate) {
                UserController.leaveTeam(teammate._id, function (err) {
                    if (err) {
                        return callback(err);
                    }
                });
            })
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

TeamController.updateTeam = function (teamCode, team, userId, callback) {
    this.getByCode(teamCode, function (err, currentTeam) {
        if (err) {
            callback(err);
        }

        if (currentTeam.owner !== userId) {
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
        }, {
            new: true
        }, callback)
    });
};

TeamController.getAllTeamsEligibleForVote = function (callback) {
    Team.find({}, function (err, teams) {

        var minGavelScore = null;
        teams.forEach(function (team) {
            if (minGavelScore === null) {
                minGavelScore = team.gavelScore;
            }
            if (team.gavelScore < minGavelScore) {
                minGavelScore = team.gavelScore;
            }
        });
        if (minGavelScore < 0) {
            var gavelAdd = Math.abs(minGavelScore);
            teams.forEach(function (team) {
                team.gavelScore += gavelAdd;
            });
        }
        teams.sort(sortTeamsByScoreDescending);
        return callback(null, teams.slice(0, 10));

    });
};

TeamController.getVoteCount = function (callback, admin) {
    Settings.getPublicSettings(function (err, settings) {

        if (settings.showVoteResults || admin) {
            User.find({}, function (err, users) {
                var voteMap = {};

                var highestVoteScore = 0;
                users.forEach(function (user) {
                    if (user.votedTeamId) {
                        var votes = voteMap[user.votedTeamId];
                        if (votes) {
                            voteMap[user.votedTeamId] += 1;
                        } else {
                            voteMap[user.votedTeamId] = 1;
                        }
                        if (voteMap[user.votedTeamId] > highestVoteScore) {
                            highestVoteScore = voteMap[user.votedTeamId];
                        }
                    }
                });


                return TeamController.getAllTeamsEligibleForVote(function (error, teams) {

                    var maxGavelScore = 0;
                    teams.forEach(function (team) {
                        if (team.gavelScore > maxGavelScore) {
                            maxGavelScore = team.gavelScore;
                        }
                    });

                    if (maxGavelScore === 0) {
                        maxGavelScore = 1;
                    }
                    if (highestVoteScore === 0) {
                        highestVoteScore = 1;
                    }
                    teams.forEach(function (team) {
                        var votesForTeam = voteMap[team._id];
                        if (!votesForTeam) {
                            votesForTeam = 0;
                        }
                        team.gavelScore = team.gavelScore / maxGavelScore;
                        team.totalScore = team.gavelScore + (votesForTeam / highestVoteScore);
                        team.totalScore *= 100;
                        team.totalScore /=2;
                        team.votes = votesForTeam;
                    });


                    return callback(null, teams);
                });
            });
        } else {
            return callback({
                message: 'Vote results are hidden'
            });
        }
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
