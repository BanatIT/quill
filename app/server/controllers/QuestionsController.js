var Question = require('../models/Question');
var User = require('../models/User');
var Team = require('../models/Team');

var QuestionsController = {};

QuestionsController.create = function (userId, value, callback) {

    User.findById(userId, function (err, user) {

        Team.findById(user.teamId, function (err, team) {
            var newQuestion = {
                userId: userId,
                value: value,
                name: user.profile.name,
                answered: 'NO'
            };

            if (team) {
                newQuestion.team = team.name;
                newQuestion.table = team.location;
            }

            Question.findOneAndUpdate({}, newQuestion, {upsert: true}, function (err, resp) {
                console.log('Created question:  ', resp, err, newQuestion);
                if (callback) {
                    callback(err, resp);
                }
            });
        });

    });

};

QuestionsController.mark = function (questionId, callback) {
    Question.findOneAndUpdate({_id: questionId}, {answered: 'YES'}, {upsert: false}, function (err, resp) {
        console.log('Responded question:  ', resp, err);
        if (callback) {
            callback(err, resp);
        }
    });
};

QuestionsController.findAll = function (callback) {
    Question.find({}, function (err, questions) {
        callback(err, questions);
    });
};

QuestionsController.findOpen = function (callback) {
    Question.find({answered: 'NO'}, function (err, questions) {
        callback(err, questions);
    });
};

QuestionsController.findMine = function (userId, callback) {
    Question.find({userId: userId}, function (err, questions) {
        callback(err, questions);
    });
};


module.exports = QuestionsController;