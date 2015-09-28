'use strict';

angular.module('peopleUiApp')
  .service('PeopleService', [
    '$http',
    'SpringDataRestAdapter',
    '$q',
    '$log',
    function PeopleService($http, SpringDataRestAdapter, $q, $log) {

      var baseUrl = "http://localhost:8080/people";

      function getAllPeople() {
        var defer = $q.defer();

        SpringDataRestAdapter.process($http.get(baseUrl)).then(function success(procesedResponse) {
          var retrievedPeople = _.map(procesedResponse._embeddedItems, function toPerson(item){
            return new ppl.Person(item);
          });
          defer.resolve(retrievedPeople);
        });
        return defer.promise;
      }

      function createPerson(person) {
        var defer = $q.defer();
        SpringDataRestAdapter.process($http.post(baseUrl, person)).then(function success(processedResponse){
          $log.info(processedResponse);
          var createdPerson = new ppl.Person(person);
          createdPerson.setSelfLink(processedResponse.headers('location'));
          defer.resolve(createdPerson);
        });
        return defer.promise;
      }

      function updatePerson(person) {
        var defer = $q.defer();
        $log.info(person);
        $log.info(person.selfLink);
        $http.put(person.selfLink, JSON.stringify(person)).then(function onSuccess(response) {
          $log.info(response);
          defer.resolve();
        });
        return defer.promise;
      }

      function deletePerson(person) {
        var defer = $q.defer();
        $http.delete(person.selfLink).success(function onSuccess(data, status, headers, config) {
          defer.resolve();
        });
        return defer.promise;
      }

      return {
        getAllPeople: getAllPeople,
        createPerson: createPerson,
        updatePerson: updatePerson,
        deletePerson: deletePerson
      };

    }]);
