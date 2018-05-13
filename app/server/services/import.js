var User = require('../models/User');
var Team = require('../models/Team');
const request = require('request');
var controller = {};

function _getValue(source, field) {
  if (source && source[field]) {
    return source[field].value;
  }

  return '';
}

controller.importGavel = function(url){
    console.log(url);
    request.get(url, function (error, request, body) {
        var data = JSON.parse(body);

        data.forEach(function (item) {

            console.log(item);
            try {
                Team.findOneAndUpdate({
                    _id: item.teamId
                }, {
                    $set: {
                        'gavelScore': item.mu
                    }
                });
            }catch (error){
                console.log('error on team score update', error);
            }
        })
    });
};

controller.importFromUrl = function (url) {
    console.log(url);
    var noTicketType = 0;
    var noTicketStatus =0, noData=0, noEmail=0, noSecurityCode=0, noTicketId=0, noError = 0;
    var noOfimports = 0;

    request.get(url, function (error, request, body){
       var data = JSON.parse(body);

       data.forEach(function (item){
           
          var attendeeData = item.attendee_meta;

          //Skip records
         var allowedTickets = ['Full Ticket', 'Student Ticket', 'Junior League Ticket', 'Mentor'];
         if (allowedTickets.indexOf(item.ticket_name) < 0 ) {
           console.warn('Order '+ item.order_id+ 'is not allowed for type: '+item.ticket_name);
           noTicketType++;
           return;
         }

         var allowedStatus = ['processing', 'completed'];
         if (allowedStatus.indexOf(item.order_status) < 0 ) {
           console.warn('Order '+ item.order_id+ 'is not allowed for status: '+item.order_status);
           noTicketStatus++;
           return;
         }
          //END Skip records

          // Validate import
          if(!attendeeData){
            console.warn('No attendee data for order'+ item.order_id);
            noData++;
            return;
          }

          if (!_getValue(attendeeData, 'e-mail-address')){
            console.warn('No email for order: '+ item.order_id);
            noEmail++;
            return
          }

          if (!item.security_code) {
            console.warn('No security for order: '+ item.order_id);
            noSecurityCode++;
            return
          }

          if (!item.ticket_id){
            console.warn('No ticket id for order: '+ item.order_id);
            noTicketId++;
            return
          }
         // END Validate import

          var profile = {
              name: _getValue(attendeeData, 'first-name') +' '+ _getValue(attendeeData, 'last-name'),
              adult: _getValue(attendeeData, 'age') > 17,
              gender: _getValue(attendeeData, 'gender').substring(0,1)
          };
          var confirmation = {
            phoneNumber: _getValue(attendeeData, 'phone-number'),
            shirtSize: _getValue(attendeeData, 't-shirt-size')
          };
          var status = {
              completedProfile: true,
              admitted: true,
              confirmed: true,
              declined: false,
              checkedIn: item.check_in.length > 0
          };
          var u = new User();
          u.ticketId = item.ticket_id;
          u.ticketType = item.ticket_name;
          u.email = _getValue(attendeeData, 'e-mail-address').trim().toLowerCase();
          u.password = User.generateHash(item.security_code);
          u.admin = false;
          u.timestamp = Date.now();
          u.salt = Date.now();
          u.verified = true;
          u.profile = profile;
          u.confirmation = confirmation;
          u.status = status;


         var userToUpdate = {};
         userToUpdate = Object.assign(userToUpdate, u._doc);
         delete userToUpdate._id;

         User.findOneAndUpdate({
           ticketId: item.ticket_id
         }, userToUpdate, { upsert: true }, function(err, res) {
           if (err) {
             noError++;
            console.error('Cound not insert or update', err);
           }

           if (res){
             noOfimports ++;
           }

         });

          // u.saveOrUpdate(function (err){
          //     if (err){
          //         // Duplicate key error codes
          //         if (err.name === 'MongoError' && (err.code === 11000 || err.code === 11001)) {
          //             // return callback({
          //             //     message: 'An account for this email already exists.'
          //             // });
          //         }
          //       console.error(err);
          //         return;
          //      //   return callback(err);
          //     }
          // });

          console.log(profile);
       });

      // noTicketType, noTicketStatus, noData, noEmail, noSecurityCode, noTicketId, noError = 0;

       console.log('Skiped '+noTicketType +' because of type');
       console.log('Skiped '+noTicketStatus +' because of status');
       console.log('Skiped '+noData +' because of missing data');
       console.log('Skiped '+noEmail +' because of missing email');
       console.log('Skiped '+noSecurityCode +' because of missing security code');
       console.log('Skiped '+noTicketId +' because of missing ticketId');
       console.log('Skiped '+noError +' because of error');
       console.log('No of imports:'+noOfimports);
    });
};


module.exports = controller;