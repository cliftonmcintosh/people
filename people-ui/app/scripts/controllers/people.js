/* global _ */

'use strict';

/**
 * @ngdoc function
 * @name peopleUiApp.controller:PeopleCtrl
 * @description
 * # PeopleCtrl
 * Controller of the peopleUiApp
 */
angular.module('peopleUiApp')
  .controller('PeopleCtrl', ['$scope', '$log', 'PeopleService', function ($scope, $log, PeopleService) {

    $scope.people = [];
    $scope.newPerson = {
      firstName: '',
      lastName: ''
    };

    function getAllPeople() {
      PeopleService.getAllPeople().then(function retrieved(data) {
        $scope.people = data;
        _.forEach($scope.people, function printEach(person) {
          $log.info(person.lastName + ', ' + person.firstName);
        });
      });
    }

    getAllPeople();

    $scope.createPerson = function createPerson(person) {
      PeopleService.createPerson(person).then(function (data) {
        $log.info("The location of the record is " + data);
        getAllPeople();
        $scope.newPerson = {
          firstName: '',
          lastName: ''
        };
      });
    };

    $scope.updatePerson = function updatePerson(person) {
      PeopleService.updatePerson(person).then(getAllPeople);
    };

    $scope.deletePerson = function deletePerson(person) {
      PeopleService.deletePerson(person).then(getAllPeople);
    };

  }]);
