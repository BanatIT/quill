ADMIN_EMAIL = process.env.ADMIN_EMAIL;
ADMIN_PASSWORD = process.env.ADMIN_PASS;

// Create a default admin user.
var User = require('../app/server/models/User');


var user = {};
user.email = ADMIN_EMAIL;
user.ticketId = 'admin';
user.password = User.generateHash(ADMIN_PASSWORD);
user.admin = true;
user.verified = true;
User.findOneAndUpdate({
    email: ADMIN_EMAIL
}, user, {upsert: true}, function (err, user) {
    console.log('Admin User Status: ', user, err);
});
