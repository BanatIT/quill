var UserController = require('../controllers/UserController');
var QuestionsController = require('../controllers/QuestionsController');
var SettingsController = require('../controllers/SettingsController');
var TeamController = require('../controllers/TeamController');
var NotificationController = require('../controllers/NotificationController');

var request = require('request');

module.exports = function (router) {


    function getToken(req) {
        return req.headers['x-access-token'];
    }

    function userCanVote(user) {
        return !user.votedTeamId;
    }

    function teamCanBeVoted(teamId, eligibleTeams) {
        for (var i = 0; i < eligibleTeams.length; i++) {
            if (eligibleTeams[i]._id.toString() === teamId) {
                return true;
            }
        }
        return false;
    }

    /**
     * Using the access token provided, check to make sure that
     * you are, indeed, an admin.
     */
    function isAdmin(req, res, next) {

        var token = getToken(req);

        UserController.getByToken(token, function (err, user) {

            if (err) {
                return res.status(500).send(err);
            }

            if (user && user.admin) {
                req.user = user;
                return next();
            }

            return res.status(401).send({
                message: 'Get outta here, punk!'
            });

        });
    }

    function isExternalToken(req, res, next) {

        if (req && req.body && req.body.api_key) {
            if (req.body.api_key === 'vladIsCool') {
                return next();
            } else {
                return res.status(401).send({
                    message: 'Invalid API Key'
                });
            }
        }

        return res.status(401).send({
            message: 'No API Key or Body Provided'
        });


    }

    /**
     * [Users API Only]
     *
     * Check that the id param matches the id encoded in the
     * access token provided.
     *
     * That, or you're the admin, so you can do whatever you
     * want I suppose!
     */
    function isOwnerOrAdmin(req, res, next) {
        var token = getToken(req);
        var userId = req.params.id;

        UserController.getByToken(token, function (err, user) {

            if (err || !user) {
                return res.status(500).send(err);
            }

            if (user._id == userId || user.admin) {
                return next();
            }
            return res.status(400).send({
                message: 'Token does not match user id.'
            });
        });
    }

    function getUserId(req, res) {
        var token = getToken(req);

        return UserController.getByToken(token, function (err, user) {
            if (err || !user) {
                return res.status(500).send(err);
            }


            return user._id;

        })
    }

    /**
     * Default response to send an error and the data.
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    function defaultResponse(req, res) {
        return function (err, data) {
            console.log('Response error', error,data);
            if (err) {
                // SLACK ALERT!
                if (process.env.NODE_ENV === 'production') {
                    request
                        .post(process.env.SLACK_HOOK,
                            {
                                form: {
                                    payload: JSON.stringify({
                                        "text":
                                            "``` \n" +
                                            "Request: \n " +
                                            req.method + ' ' + req.url +
                                            "\n ------------------------------------ \n" +
                                            "Body: \n " +
                                            JSON.stringify(req.body, null, 2) +
                                            "\n ------------------------------------ \n" +
                                            "\nError:\n" +
                                            JSON.stringify(err, null, 2) +
                                            "``` \n"
                                    })
                                }
                            },
                            function (error, response, body) {
                                return res.status(500).send({
                                    message: "Your error has been recorded, we'll get right on it!"
                                });
                            }
                        );
                } else {
                    return res.status(500).send(err);
                }
            } else {
                return res.json(data);
            }
        };
    }

    /**
     *  API!
     */

    // ---------------------------------------------
    // Users
    // ---------------------------------------------

    /**
     * [ADMIN ONLY]
     *
     * GET - Get all users, or a page at a time.
     * ex. Paginate with ?page=0&size=100
     */
    router.get('/users', isAdmin, function (req, res) {
        var query = req.query;

        if (query.page && query.size) {

            UserController.getPage(query, defaultResponse(req, res));

        } else {

            UserController.getAll(defaultResponse(req, res));

        }
    });

    router.put('/questions/ask', function (req, res) {
        var userId = req.params.id;
        var value = req.body.value;
        QuestionsController.create(userId, value, defaultResponse(req, res));
    });

    router.put('/questions/mark', isOwnerOrAdmin, function (req, res) {
        var qid = req.body.questionId;
        QuestionsController.mark(qid, defaultResponse(req, res));
    });

    router.get('/questions/mine', function (req, res) {
        var userId = req.params.id;
        QuestionsController.findMine(userId,defaultResponse(req, res));
    });

    router.get('/questions/all', function (req, res) {
        QuestionsController.findAll(defaultResponse(req, res));
    });

    router.get('/questions/open', function (req, res) {
        QuestionsController.findOpen(defaultResponse(req, res));
    });

    /**
     * [ADMIN ONLY]
     */
    router.get('/users/stats', isAdmin, function (req, res) {
        UserController.getStats(defaultResponse(req, res));
    });


    router.get('/users/stats', isAdmin, function (req, res) {
        UserController.getStats(defaultResponse(req, res));
    });

    /**
     * [OWNER/ADMIN]
     *
     * GET - Get a specific user.
     */
    router.get('/users/:id', isOwnerOrAdmin, function (req, res) {
        UserController.getById(req.params.id, defaultResponse(req, res));
    });

    /**
     * [OWNER/ADMIN]
     *
     * PUT - Update a specific user's profile.
     */
    router.put('/users/:id/profile', isOwnerOrAdmin, function (req, res) {
        var profile = req.body.profile;
        var id = req.params.id;

        UserController.updateProfileById(id, profile, defaultResponse(req, res));
    });

    /**
     * [OWNER/ADMIN]
     *
     * PUT - Update a specific user's confirmation information.
     */
    router.put('/users/:id/confirm', isOwnerOrAdmin, function (req, res) {
        var confirmation = req.body.confirmation;
        var id = req.params.id;

        UserController.updateConfirmationById(id, confirmation, defaultResponse(req, res));
    });

    /**
     * [OWNER/ADMIN]
     *
     * POST - Decline an acceptance.
     */
    router.post('/users/:id/decline', isOwnerOrAdmin, function (req, res) {
        var confirmation = req.body.confirmation;
        var id = req.params.id;

        UserController.declineById(id, defaultResponse(req, res));
    });

    /**
     * Get a user's team member's names. Uses the code associated
     * with the user making the request.
     */
    router.get('/users/:id/team', isOwnerOrAdmin, function (req, res) {
        var id = req.params.id;
        UserController.getTeammates(id, defaultResponse(req, res));
    });

    /**
     * Update a teamcode. Join/Create a team here.
     * {
     *   code: STRING
     * }
     */
    router.put('/users/:id/team', isOwnerOrAdmin, function (req, res) {
        var code = req.body.code;
        var id = req.params.id;

        UserController.createOrJoinTeam(id, code, defaultResponse(req, res));

    });

    /**
     * Remove a user from a team.
     */
    router.delete('/users/:id/team', isOwnerOrAdmin, function (req, res) {
        var id = req.params.id;

        UserController.leaveTeam(id, defaultResponse(req, res));
    });

    /**
     * Update a user's password.
     * {
     *   oldPassword: STRING,
     *   newPassword: STRING
     * }
     */
    router.put('/users/:id/password', isOwnerOrAdmin, function (req, res) {
        return res.status(304).send();
        // Currently disable.
        // var id = req.params.id;
        // var old = req.body.oldPassword;
        // var pass = req.body.newPassword;

        // UserController.changePassword(id, old, pass, function(err, user){
        //   if (err || !user){
        //     return res.status(400).send(err);
        //   }
        //   return res.json(user);
        // });
    });

    /**
     * Admit a user. ADMIN ONLY, DUH
     *
     * Also attaches the user who did the admitting, for liabaility.
     */
    router.post('/users/:id/admit', isAdmin, function (req, res) {
        // Accept the hacker. Admin only
        var id = req.params.id;
        var user = req.user;
        UserController.admitUser(id, user, defaultResponse(req, res));
    });

    /**
     * Check in a user. ADMIN ONLY, DUH
     */
    router.post('/users/:id/checkin', isAdmin, function (req, res) {
        var id = req.params.id;
        var user = req.user;
        UserController.checkInById(id, user, defaultResponse(req, res));
    });

    /**
     * Check in a user. ADMIN ONLY, DUH
     */
    router.post('/users/:id/checkout', isAdmin, function (req, res) {
        var id = req.params.id;
        var user = req.user;
        UserController.checkOutById(id, user, defaultResponse(req, res));
    });


    // ---------------------------------------------
    // Teams
    // ---------------------------------------------

    /**
     * Get all registered teams
     */
    router.get('/teams', function (req, res) {
        TeamController.getTeams(defaultResponse(req, res));
    });

    /**
     * get team by code
     */
    router.get('/teams/:code', function (req, res) {
        var code = req.params.code;
        TeamController.getByCode(code, defaultResponse(req, res));
    });


    /**
     * update team
     */
    router.post('/teams/:code', function (req, res) {
        var code = req.params.code;
        var team = req.body.team;
        var token = getToken(req);

        // var userId;
        UserController.getByToken(token, function (err, user) {
            if (user) {
                TeamController.updateTeam(code, team, user._id.toString(), defaultResponse(req, res));
            }
        })

    });


    router.delete('/teams/:code', function (req, res) {
        var code = req.params.code;
        var token = getToken(req);

        // var userId;
        UserController.getByToken(token, function (err, user) {
            if (user) {
                TeamController.deleteTeam(code, user._id.toString(), defaultResponse(req, res));
            }
        })
    });


    /**
     * create team
     */
    router.post('/teams', function (req, res) {
        var team = req.body.team;
        var userId = req.body.userId;
        TeamController.createTeam(team, userId, defaultResponse(req, res));
    });

    router.get('/vote', function (req, res) {
        TeamController.getVoteCount(defaultResponse(req, res));
    });

    router.get('/vote/teams', function (req, res) {
        TeamController.getAllTeamsEligibleForVote(defaultResponse(req, res));
    });


    router.get('/vote/teams/admin', isAdmin, function (req, res) {
        TeamController.getVoteCount(defaultResponse(req, res), true);
    });

    router.post('/vote', function (req, res) {
        var teamId = req.body.teamId;
        var token = getToken(req);

        // var userId;
        UserController.getByToken(token, function (err, user) {
            if (user && userCanVote(user)) {
                TeamController.getAllTeamsEligibleForVote(function (err, eligibleTeams) {

                    if (teamCanBeVoted(teamId, eligibleTeams)) {
                        UserController.voteTeam(user, teamId, defaultResponse(req, res));
                    } else {
                        return res.status(409).send({
                            message: 'Team cannot be voted'
                        });
                    }
                });

            } else {
                return res.status(400).send({
                    message: 'You cannot vote or have already voted'
                });
            }
        });
    });

    // ---------------------------------------------
    // Settings [ADMIN ONLY!]
    // ---------------------------------------------

    /**
     * Get the public settings.
     * res: {
     *   timeOpen: Number,
     *   timeClose: Number,
     *   timeToConfirm: Number,
     *   acceptanceText: String,
     *   confirmationText: String,
     *   allowMinors: Boolean
     * }
     */
    router.get('/settings', function (req, res) {
        SettingsController.getPublicSettings(defaultResponse(req, res));
    });

    router.put('/settings/import', isAdmin, function (req, res) {
        var url = req.body.url;
        SettingsController.importFromUrl(url, defaultResponse(req, res));
    });
    router.put('/settings/import-gavel', isAdmin, function (req, res) {
        var url = req.body.url;
        SettingsController.importGavel(url, defaultResponse(req, res));
    });

    router.put('/settings/wipe', isAdmin, function (req, res) {
        SettingsController.wipe(defaultResponse(req, res));
    });

    router.put('/settings/vote-results', isAdmin, function (req, res) {
        var showVoteResults = req.body.showVoteResults;
        SettingsController.updateField('showVoteResults', showVoteResults, defaultResponse(req, res));
    });

    router.put('/settings/voting-enabled', isAdmin, function (req, res) {
        var votingEnabled = req.body.votingEnabled;
        SettingsController.updateField('votingEnabled', votingEnabled, defaultResponse(req, res));
    });


    router.put('/notification/create', isAdmin, function (req, res) {
        var title = req.body.title;
        var description = req.body.description;

        NotificationController.createNotification(title, description,
            function (err, notification) {
                if (err) {
                    return res.status(400).send(err);
                }
                return res.json(notification);
            });
    });

    /**
     * [ADMIN ONLY]
     *
     * GET - Get all notifications
     */
    router.get('/notification', function (req, res) {
        NotificationController.getAll(defaultResponse(req, res));
    });


    router.post('/cash', isExternalToken, function (req, res) {
        return res.json(req.body);
    });
};
