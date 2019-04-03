ADMIN_EMAIL = process.env.ADMIN_EMAIL;
ADMIN_PASSWORD = process.env.ADMIN_PASS;

// Create a default admin user.
var User = require('../app/server/models/User');

// If there is already a user
User.findOne({
    email: ADMIN_EMAIL
}).exec(function (err, user) {
    if (!user) {
        user = new User();
        setProperties(user);
        u.save(function (err) {
            if (err) {
                console.log(err);
            }
        });
    } else {
        setProperties(user);
        u.update(function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
});


function setProperties(user) {
    user.email = ADMIN_EMAIL;
    user.ticketId = 'admin';
    user.password = User.generateHash(ADMIN_PASSWORD);
    user.admin = true;
    user.verified = true;
}