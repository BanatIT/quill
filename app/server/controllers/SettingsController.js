var Settings = require('../models/Settings');
var User = require('../models/User');
var Team = require('../models/Team');
var Question = require('../models/Question');
var Notification = require('../models/Notification');
var Import = require('../services/import');


var SettingsController = {};

/**
 * Update any field in the settings.
 * @param  {String}   field    Name of the field
 * @param  {Any}      value    Value to replace it to
 * @param  {Function} callback args(err, settings)
 */
SettingsController.updateField = function (field, value, callback) {
    var update = {};
    update[field] = value;
    Settings
        .findOneAndUpdate({}, {
            $set: update
        }, {new: true}, callback);
};


/**
 * Imports user data from URL
 */
SettingsController.importFromUrl = function (url, callback) {
    var updatedUrl = {};

    if (url) {
        updatedUrl.importFromUrl = url;
    }

    Import.importFromUrl(url);

    Settings
        .findOneAndUpdate({}, {
            $set: updatedUrl
        }, {new: true}, callback);

};


SettingsController.wipe = function (callback) {

    Notification.remove({}, function () {
    });
    Team.remove({}, function () {
    });
    User.remove({ email : { $ne: process.env.ADMIN_EMAIL } } , function () {
    });
    Question.remove({} , function () {
    });
    callback(null, {message: 'success'});

};

SettingsController.importGavel = function (url, callback) {
    Import.importGavel(url);
    callback(null, {message: 'success'})
};


/**
 * Get all public settings.
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
SettingsController.getPublicSettings = function (callback) {
    Settings.getPublicSettings(callback);
};

module.exports = SettingsController;