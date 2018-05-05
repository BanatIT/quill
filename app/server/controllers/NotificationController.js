var Notification = require('../models/Notification');

var NotificationController = {};

NotificationController.createNotification = function(title, description, callback) {

    var noti = new Notification();
    noti.title = title;
    noti.description = description;
    noti.timestamp = Date.now();
    noti.save(function(err){
        if (err){
            return callback({
                message: 'Error occured.'
            });
        } else {
            return callback(null, {
                message: 'Notification added.'
            }
          );
        }

    });
};

/**
 * Get all notifications.
 * It's going to be a lot of data, so make sure you want to do this.
 * @param  {Function} callback args(err, user)
 * @todo implement pagination
 */
NotificationController.getAll = function (callback) {
    Notification.find({})
                .sort({
                    'timestamp': 'desc'
                }).exec(callback);
};

module.exports = NotificationController;