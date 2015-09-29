'use strict';

describe('Controller: PeopleCtrl', function () {

  // load the controller's module
  beforeEach(module('peopleUiApp'));

  var PeopleCtrl,
    q,
    scope,
    MockLog,
    MockPeopleService,
    getAllPeopleSpy,
    createPersonSpy,
    updatePersonSpy,
    deletePersonSpy;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q) {
    scope = $rootScope.$new();
    q = $q;
    getAllPeopleSpy = jasmine.createSpy('getAllPeople');
    createPersonSpy = jasmine.createSpy('createPerson');
    updatePersonSpy = jasmine.createSpy('updatePerson');
    deletePersonSpy = jasmine.createSpy('deletePerson');
    MockPeopleService = {
      getAllPeople: getAllPeopleSpy,
      createPerson: createPersonSpy,
      updatePerson: updatePersonSpy,
      deletePerson: deletePersonSpy
    };
    MockLog = {
      info: function info(data) {
        // do nothing
      }
    };
    getAllPeopleSpy.and.callFake(function () {
      var deferred = q.defer();
      deferred.resolve([new ppl.Person({firstName: 'Jimmy', lastName: 'Williams', selfLink: 'http://localhost:8080/people/1'})]);
      return deferred.promise;
    });

    PeopleCtrl = $controller('PeopleCtrl', {
      $scope: scope,
      PeopleService: MockPeopleService,
      $log: MockLog
    });
  }));

  it('should load all people on startup', function initializationSpec() {
    scope.$digest();
    expect(getAllPeopleSpy).toHaveBeenCalled();
    expect(scope.people.length).toBe(1);
  });

  describe('createPerson', function createPersonSpec() {
    var personToCreate;

    beforeEach(function () {
      personToCreate = {
        firstName: 'Fred',
        lastName: 'Rogers'
      };
      createPersonSpy.and.callFake(function fakeCreate() {
        var deferred = q.defer();
        deferred.resolve('http://localhost:8080/people/1');
        return deferred.promise;
      });
    });


    it('should pass the person along to the PeopleService.createPerson and retrieve all people afterwards', function () {
      scope.createPerson(personToCreate);

      scope.$digest();
      expect(createPersonSpy).toHaveBeenCalledWith(personToCreate);
      expect(getAllPeopleSpy.calls.count()).toBe(2);
      expect(scope.newPerson).not.toBeFalsy();
      expect(scope.newPerson.firstName).toBeFalsy();
      expect(scope.newPerson.lastName).toBeFalsy();
    });
  });

  describe('updatePerson', function updatePersonSpec() {
    var personToUpdate;

    beforeEach(function () {
      personToUpdate = {
        firstName: 'Fred',
        lastName: 'Rogers'
      };
      updatePersonSpy.and.callFake(function fakeUpdate() {
        var deferred = q.defer();
        deferred.resolve();
        return deferred.promise;
      });
    });


    it('should pass the person along to the PeopleService.updatePerson and retrieve all people afterwards', function () {
      scope.updatePerson(personToUpdate);

      scope.$digest();
      expect(updatePersonSpy).toHaveBeenCalledWith(personToUpdate);
      expect(getAllPeopleSpy.calls.count()).toBe(2);
    });
  });

  describe('deletePerson', function deletePersonSpec() {
    var personToDelete;

    beforeEach(function () {
      personToDelete = {
        firstName: 'Fred',
        lastName: 'Rogers'
      };
      deletePersonSpy.and.callFake(function fakeDelete() {
        var deferred = q.defer();
        deferred.resolve();
        return deferred.promise;
      });
    });


    it('should pass the person along to the PeopleService.deletePerson and retrieve all people afterwards', function () {
      scope.deletePerson(personToDelete);

      scope.$digest();
      expect(deletePersonSpy).toHaveBeenCalledWith(personToDelete);
      expect(getAllPeopleSpy.calls.count()).toBe(2);
    });
  });

});
