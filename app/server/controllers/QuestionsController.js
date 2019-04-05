var Question = require('../models/Question');
var QuestionsController = {};

QuestionsController.create = function (userId, value, callback) {
    var newQuestion = {
        userId: userId,
        value: value,
        answered: 'NO'
    };

    Question.findOneAndUpdate({}, newQuestion, {upsert: true}, function (err, resp) {
        console.log('Created question:  ', resp, err);
        if (callback) {
            callback(err, resp);
        }
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