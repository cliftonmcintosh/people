/* global _ */

'use strict';

var ppl = ppl || {};

(function (ns) {
  ns.FamiliesCtrl = function FamiliesCtrl($scope, $log, PeopleService, FamiliesService) {

    $scope.families = [];
    $scope.people = [];
    $scope.newPerson = {
      firstName: '',
      lastName: ''
    };
    $scope.personToAdd = undefined;

    $scope.newFamily = [
      new ppl.Person({})
    ];

    $scope.addPerson = function addPerson() {
      $scope.newFamily.push(new ppl.Person({}));
    };

    $scope.createFamily = function createFamily() {
      FamiliesService.createFamily($scope.newFamily).then(function () {
        $scope.newFamily = [
          new ppl.Person({})
        ];
        getAllFamilies();
      });
    };

    $scope.addPersonToFamily = function addPersonToFamily(personLink, familyLink) {
      FamiliesService.addPersonToFamily(personLink, familyLink).then(function () {
        $scope.personToAdd = undefined;
        getAllFamilies();
      });
    };

    $scope.removePersonFromFamily = function removePersonFromFamily(person) {
      FamiliesService.removePersonFromFamily(person).then(getAllFamilies);
    };

    function getAllFamilies() {
      FamiliesService.getAllFamilies().then(function retrieved(data) {
        $scope.families = data;
        _.forEach($scope.families, function printEach(family) {
          $log.info('Link for family is' + family.selfLink);
        });
      });
    }

    function getAllPeople() {
      PeopleService.getAllPeople().then(function retrieved(data) {
        $scope.people = data;
        _.forEach($scope.people, function printEach(person) {
          $log.info(person.lastName + ', ' + person.firstName);
        });
      });
    }

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

    $scope.deleteFamily = function deleteFamily(family) {
      FamiliesService.deleteFamily(family).then(getAllFamilies);
    };

    getAllPeople();
    getAllFamilies();
  }
})(ppl);

/**
 * @ngdoc function
 * @name peopleUiApp.controller:PeopleCtrl
 * @description
 * # PeopleCtrl
 * Controller of the peopleUiApp
 */
angular.module('peopleUiApp')
  .controller('FamiliesCtrl', ['$scope', '$log', 'PeopleService', 'FamiliesService', ppl.FamiliesCtrl]);
