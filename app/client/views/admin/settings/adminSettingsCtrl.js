angular.module('reg')
    .controller('AdminSettingsCtrl', [
        '$scope',
        '$sce',
        'SettingsService',
        function ($scope, $sce, SettingsService) {

            $scope.settings = {};
            $scope.wipe = { value : 'Enter "WIPE" and submit'};

            SettingsService
                .getPublicSettings()
                .success(function (settings) {
                    updateSettings(settings);
                });

            function updateSettings(settings) {
                $scope.loading = false;
                $scope.settings = settings;
            }

            $scope.wipe = function () {
                if ("WIPE" === $scope.wipe.value) {
                    SettingsService.wipe().success(function () {
                        $scope.wipe.value = 'Enter "WIPE" and submit';
                        swal("Looks good!", "Everything has been wiped clean!", "success");
                    });
                } else {
                    swal("Error!", "Safety: You cannot wipe without entering 'WIPE'!", "warn");
                }
            };


            $scope.updateShowVoteResults = function () {
                SettingsService
                    .updateShowVoteResults($scope.settings.showVoteResults)
                    .success(function (data) {
                        $scope.settings.showVoteResults = data.showVoteResults;
                        var successText = $scope.settings.showVoteResults ?
                            "Vote Results are shown!" :
                            "Vote Results are NOT shown!";
                        swal("Looks good!", successText, "success");
                    });
            };

            $scope.updateVotingEnabled = function () {
                SettingsService
                    .updateVotingEnabled($scope.settings.votingEnabled)
                    .success(function (data) {
                        $scope.settings.votingEnabled = data.votingEnabled;
                        var successText = $scope.settings.votingEnabled ?
                            "Voting is now ENABLED." :
                            "Voting is now DISABLED.";
                        swal("Looks good!", successText, "success");
                    });
            };

            $scope.importGavel = function () {
                var url = $scope.settings.importGavelUrl;
                SettingsService
                    .importGavel(url)
                    .success(function (settings) {
                        updateSettings(settings);
                        swal("Sounds good!", "Scores Imported from Gavel", "success");
                    })
            };

            // Import from URL -------------------------------
            $scope.import = function () {
                var url = $scope.settings.importFromUrl;
                SettingsService
                    .import(url)
                    .success(function (settings) {
                        updateSettings(settings);
                        swal("Sounds good!", "imp Date Updated", "success");
                    })
            };

            // Acceptance / Confirmation Text ----------------

            var converter = new showdown.Converter();

            $scope.markdownPreview = function (text) {
                return $sce.trustAsHtml(converter.makeHtml(text));
            };


        }]);