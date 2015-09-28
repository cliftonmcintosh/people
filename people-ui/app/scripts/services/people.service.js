'use strict';

angular.module('peopleUiApp')
  .service('PeopleService', [
    '$resource',
    '$http',
    'SpringDataRestAdapter',
    '$q',
    '$log',
    function PeopleService($resource, $http, SpringDataRestAdapter, $q, $log) {

      var people = $resource("http://localhost:8080/people");
      var response;

      function getAllPeople() {
        var defer = $q.defer();
        var allResponse;
        var httpPromise = $http.get("http://localhost:8080/people").success(function (response) {
          allResponse = angular.toJson(response, true);
        });

        $log.info(response);

        SpringDataRestAdapter.process(httpPromise).then(function success(procesedResponse) {
          defer.resolve(procesedResponse._embeddedItems);
        });
        return defer.promise;
      }

      function createPerson(person) {
        var defer = $q.defer();
        $http.post("http://localhost:8080/people", person).success(function success(data, status, headers, config) {
          var selfHref = headers('location');
          defer.resolve(selfHref);
        });
        return defer.promise;
      }

      function updatePerson(person) {
        var defer = $q.defer();
        $log.info(person);
        var selfHref = person._links.self.href;
        var updated = {
          firstName: person.firstName,
          lastName: person.lastName
        };
        $log.info(selfHref);
        $http.put(selfHref, JSON.stringify(updated)).success(function onSuccess(response) {
          $log.info(response);
          defer.resolve();
        });
        return defer.promise;
      }

      function deletePerson(person) {
        var defer = $q.defer();
        var selfHref = person._links.self.href;
        $http.delete(selfHref).success(function onSuccess(data, status, headers, config) {
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
