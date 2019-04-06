angular.module('reg')
    .factory('SettingsService', [
        '$http',
        function ($http) {

            var base = '/api/settings/';

            return {

                resetScores: function(){
                    return $http.put(base + 'reset-scores', {
                    });
                },

                getPublicSettings: function () {
                    return $http.get(base);
                },

                updateRegistrationTimes: function (open, close) {
                    return $http.put(base + 'times', {
                        timeOpen: open,
                        timeClose: close,
                    });
                },
                updateConfirmationTime: function (time) {
                    return $http.put(base + 'confirm-by', {
                        time: time
                    });
                },
                import: function (url) {
                    return $http.put(base + 'import', {
                        url: url
                    });
                },
                importGavel: function (url) {
                    return $http.put(base + 'import-gavel', {
                        url: url
                    });
                },
                getWhitelistedEmails: function () {
                    return $http.get(base + 'whitelist');
                },
                updateWhitelistedEmails: function (emails) {
                    return $http.put(base + 'whitelist', {
                        emails: emails
                    });
                },
                updateWaitlistText: function (text) {
                    return $http.put(base + 'waitlist', {
                        text: text
                    });
                },
                updateAcceptanceText: function (text) {
                    return $http.put(base + 'acceptance', {
                        text: text
                    });
                },
                updateConfirmationText: function (text) {
                    return $http.put(base + 'confirmation', {
                        text: text
                    });
                },
                updateAllowMinors: function (allowMinors) {
                    return $http.put(base + 'minors', {
                        allowMinors: allowMinors
                    });
                },
                updateAllowRegistration: function (allowRegistration) {
                    return $http.put(base + 'registration', {
                        allowRegistration: allowRegistration
                    });
                },
                updateShowVoteResults: function (showVoteResults) {
                    return $http.put(base + 'vote-results', {
                        showVoteResults: showVoteResults
                    });
                },
                wipe: function () {
                    return $http.put(base + 'wipe', {
                    });
                },
                updateVotingEnabled: function (votingEnabled) {
                    return $http.put(base + 'voting-enabled', {
                        votingEnabled: votingEnabled
                    });
                }
            };

        }
    ]);
