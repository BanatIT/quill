var User = require('../models/User');
const request = require('request');
var controller = {};

controller.importFromUrl = function (url) {
    console.log(url);
    request.get(url, function (error, request, body){
       var data = JSON.parse(body);

       data.forEach(function (item){
          var attendeeData = item.attendee_meta;

          if(!attendeeData){
            return;
          }

          var profile = {
              name: attendeeData['first-name'].value +' '+ attendeeData['last-name'].value,
              adult: attendeeData['age'].value > 17,
              gender: attendeeData['gender'].value.substring(0,1)
          };
          var confirmation = {
            phoneNumber: attendeeData['phone-number'].value,
            shirtSize: attendeeData['t-shirt-size'].value
          };
          var status = {
              completedProfile: true,
              admitted: true,
              confirmed: true,
              declined: false,
              checkedIn: false
          };
          var u = new User();
          u.email = attendeeData['e-mail-address'].value;
          u.password = User.generateHash(item.security_code);
          u.admin = false;
          u.timestamp = Date.now();
          u.salt = Date.now();
          u.verified = true;
          u.profile = profile;
          u.confirmation = confirmation;
          u.status = status;

          u.save(function (err){
              if (err){
                  // Duplicate key error codes
                  if (err.name === 'MongoError' && (err.code === 11000 || err.code === 11001)) {
                      // return callback({
                      //     message: 'An account for this email already exists.'
                      // });
                  }
                console.log(err)
               //   return callback(err);
              }
          });

          console.log(profile);
       });


    });
};


module.exports = controller;