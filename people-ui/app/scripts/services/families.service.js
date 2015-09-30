'use strict';

ppl = ppl || {};

(function (ns) {
  ns.FamiliesService = function FamiliesService($http, SpringDataRestAdapter, $q, $log, PeopleService) {

    var baseFamiliesUrl = "http://localhost:8080/families";

    function getPeopleInFamily(familyLink) {
      var defer = $q.defer();
      var family = {
        people: [],
        selfLink: familyLink
      };
      SpringDataRestAdapter.process($http.get(familyLink + '/people')).then(function success(people){
        _.forEach(people._embeddedItems, function getPerson(personData){
          family.people.push(new ppl.Person(personData))
        });
        defer.resolve(family);
      });
      return defer.promise;
    }

    function getAllFamilyLinks() {
      var linksDefer = $q.defer();
      SpringDataRestAdapter.process($http.get(baseFamiliesUrl)).then(function success(families) {
        var familyLinks = _.map(families._embeddedItems, function getLink(item) {
          return item._links.self.href;
        });
        linksDefer.resolve(familyLinks);
      });
      return linksDefer.promise;
    }

    function getAllFamilies() {
      var allFamiliesDefer = $q.defer();
      getAllFamilyLinks().then(function (result) {
        $log.info(result);
        return $q.all(_.map(result, function(one){
          return getPeopleInFamily(one);
        }))
      }).then(function(data){

        allFamiliesDefer.resolve(data);
      });
      return allFamiliesDefer.promise;
    }

    function makeNewEmptyFamily() {
      var defer = $q.defer();
      var newFamily = {
        people: []
      };
      SpringDataRestAdapter.process($http.post(baseFamiliesUrl, JSON.stringify(newFamily))).then(function success(processedResponse) {
        $log.info(processedResponse);
        defer.resolve(processedResponse.headers('location'));
      });
      return defer.promise;
    }

    function deleteFamily(family) {
      var defer = $q.defer();
      $http.delete(family.selfLink).then(defer.resolve);
      return defer.promise;
    }

    function createFamily(unsavedFamily) {
      var defer = $q.defer();
      var newPeople = [];

      $q.all(_.map(unsavedFamily, function makePersonCreationPromise(personToSave) {
        return PeopleService.createPerson(personToSave).then(function savePerson(savedPerson) {
          newPeople.push(savedPerson)
        });
      })).then(makeNewEmptyFamily).then(function setFamilyOnPeople(familyLink) {
        $q.all(_.map(newPeople, function addFamilyToPerson(person){
          if (person && person.selfLink) {
            $log.info(person);
            $log.info(familyLink);
            return addPersonToFamily(person.selfLink, familyLink);
          } else {
            return $q.when();
          }
        })).then(function done() {
          defer.resolve(familyLink);
        });
      });
      return defer.promise;
    }

    function addPersonToFamily(personLink, familyLink) {
      var defer = $q.defer();
      $log.info(personLink);
      $log.info(familyLink);
      var request = {
        method: 'PUT',
        url: personLink + '/family',
        headers: {
          'Content-Type': 'text/uri-list'
        },
        data: familyLink
      };
      $http(request).then(defer.resolve);
      return defer.promise;
    }

    function removePersonFromFamily(person) {
      var defer = $q.defer();
      $http.delete(person.selfLink + '/family').then(defer.resolve);
      return defer.promise;
    }

    return {
      getAllFamilies: getAllFamilies,
      createFamily: createFamily,
      addPersonToFamily: addPersonToFamily,
      deleteFamily: deleteFamily,
      removePersonFromFamily: removePersonFromFamily
    };

  }
})(ppl);

angular.module('peopleUiApp')
  .service('FamiliesService', [
    '$http',
    'SpringDataRestAdapter',
    '$q',
    '$log',
    'PeopleService',
    ppl.FamiliesService]);
