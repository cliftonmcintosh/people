'use strict';

var ppl = ppl || {};

(function (ns) {
  ns.PeopleService = function PeopleService($http, SpringDataRestAdapter, $q) {

    var baseUrl = 'http://localhost:8080/people';

    function getAllPeople() {
      var defer = $q.defer();

      SpringDataRestAdapter.process($http.get(baseUrl)).then(function success(processedResponse) {
        var retrievedPeople = _.map(processedResponse._embeddedItems, function toPerson(item) {
          return new ppl.Person(item);
        });
        defer.resolve(retrievedPeople);
      });
      return defer.promise;
    }

    function getPerson(id) {
      var defer = $q.defer();
      if (id) {
        $http.get(baseUrl + id).then(function success(personData) {
          defer.resolve(new ppl.Person(personData));
        });
      } else {
        defer.reject('No ID given');
      }
      return defer.promise;
    }

    function createPerson(person) {
      var defer = $q.defer();
      if (person.firstName || person.lastName) {
        SpringDataRestAdapter.process($http.post(baseUrl, person)).then(function success(processedResponse) {
          var createdPerson = new ppl.Person(person);
          createdPerson.setSelfLink(processedResponse.headers('location'));
          defer.resolve(createdPerson);
        });
      } else {
        defer.resolve();
      }
      return defer.promise;
    }

    function updatePerson(person) {
      var defer = $q.defer();
      $http.put(person.selfLink, JSON.stringify(person)).then(defer.resolve);
      return defer.promise;
    }

    function deletePerson(person) {
      var defer = $q.defer();
      $http.delete(person.selfLink).then(defer.resolve);
      return defer.promise;
    }

    return {
      getAllPeople: getAllPeople,
      getPerson: getPerson,
      createPerson: createPerson,
      updatePerson: updatePerson,
      deletePerson: deletePerson
    };
  }
})(ppl);

angular.module('peopleUiApp')
  .service('PeopleService', [
    '$http',
    'SpringDataRestAdapter',
    '$q',
    ppl.PeopleService]);
