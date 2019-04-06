ADMIN_EMAIL = process.env.ADMIN_EMAIL;
ADMIN_PASSWORD = process.env.ADMIN_PASS;

// Create a default admin user.
var User = require('../app/server/models/User');
var Question = require('../app/server/models/Question');


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


// custom users
// createCustomUser();

function createCustomUser() {


    var user1 = new User();
    var profile = {
        name: 'szzsolt42@yahoo.com',
        adult: true,
        gender: 'M'
    };
    var confirmation = {
        phoneNumber: '12345678',
        shirtSize: 'M'
    };
    var status = {
        completedProfile: true,
        admitted: true,
        confirmed: true,
        declined: false,
        checkedIn: true
    };

    user1.ticketId = 'HO-64-NLMI3G'.toLowerCase();
    user1.ticketType = 'Student Pass';
    user1.email = 'szzsolt42@yahoo.com'.toLowerCase();
    user1.password = User.generateHash('46c0593c57');
    user1.admin = false;
    user1.timestamp = Date.now();
    user1.salt = Date.now();
    user1.verified = true;
    user1.profile = profile;
    user1.confirmation = confirmation;
    user1.status = status;
    user1.securityCode = '46c0593c57';

    console.log('Creating custom user', user1);
    user1.save(function (err, data) {
        console.log(err, data);
    });
}