angular.module('reg')
    .factory('VoteService', [
        '$http',
        'Session',
        function ($http, Session) {

            var votes = '/api/vote';

            return {

                getAllTeamsEligibleForVote: function () {
                    return $http.get(votes);
                },

                castVote: function (teamId) {
                    return $http.post(votes, {
                        teamId: teamId
                    });
                }


            }
        }
    ]);