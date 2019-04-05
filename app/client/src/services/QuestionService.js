angular.module('reg')
    .factory('QuestionService', [
        '$http',
        'Session',
        function ($http, Session) {

            var url = '/api/questions';

            return {

                create: function (value) {
                    return $http.post(url + "/ask", {
                        value: value
                    });
                },

                mark: function (questionId) {
                    return $http.post(url + "/mark", {
                        questionId: questionId
                    });
                },

                mine: function () {
                    return $http.get(url + "/mine");
                },

                all: function () {
                    return $http.get(url + "/all");
                },

                open: function () {
                    return $http.get(url + "/open");
                }


            }
        }
    ]);