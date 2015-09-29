'use strict';

describe('Service: PeopleService', function() {

  var PeopleService,
    scope,
    http,
    SpringDataRestAdapter,
    restProcessSpy,
    httpGetSpy,
    httpPostSpy,
    httpPutSpy,
    httpDeleteSpy,
    q,
    log,
    peopleData;

  beforeEach(function() {
    module('peopleUiApp');
    inject(function($rootScope, $q){
      scope = $rootScope.$new();
      q = $q;
    });

    restProcessSpy = jasmine.createSpy('process');
    httpGetSpy = jasmine.createSpy('get');
    httpPostSpy = jasmine.createSpy('post');
    httpPutSpy = jasmine.createSpy('put');
    httpDeleteSpy = jasmine.createSpy('delete');
    SpringDataRestAdapter = {
      process: restProcessSpy
    };
    http = {
      get: httpGetSpy,
      post: httpPostSpy,
      put: httpPutSpy,
      delete: httpDeleteSpy
    };
    log = {
      info: function(data){}
    };

    peopleData = {
      "_links" : {
        "search" : {
          "href" : "http://localhost:8080/people/search"
        }
      },
      "_embeddedItems" : [ {
          "firstName" : "Jeremy",
          "lastName" : "Bentham",
          "_links" : {
            "self" : {
              "href" : "http://localhost:8080/people/2"
            },
            "family" : {
              "href" : "http://localhost:8080/people/2/family"
            }
          }
        } ]
      };

    PeopleService = new ppl.PeopleService(http, SpringDataRestAdapter, q, log);

  });

  describe('getAllPeople', function(){

    beforeEach(function() {
      httpGetSpy.and.callFake(function(url){
        return peopleData;
      });
      restProcessSpy.and.callFake(function(input){
        return {
          then: function(callback) {
            return callback(input);
          }
        }
      })
    });

    it('should return the value that it receives', function() {
      var peoplePromise = PeopleService.getAllPeople();
      var resolved = undefined;
      peoplePromise.then(function(value){
        resolved = value;
      });
      scope.$apply();
      expect(httpGetSpy).toHaveBeenCalled();
      expect(restProcessSpy).toHaveBeenCalledWith(peopleData);
      expect(resolved).toBeDefined();
      expect(resolved.length).toBe(1);
      expect(resolved[0].firstName).toBe('Jeremy');
    });
  });

  describe('createPerson', function(){

    beforeEach(function() {
      httpPostSpy.and.callFake(function(url){
        return {
          headers: function(name) {
            return "http://localhost:8080/people/2";
          }
        };
      });
      restProcessSpy.and.callFake(function(input){
        return {
          then: function(callback) {
            return callback(input);
          }
        }
      })
    });

    it('should return the person with a link', function() {
      var newPerson = new ppl.Person({firstName: 'James', lastName: 'Donohue'});
      var creationPromise = PeopleService.createPerson(newPerson);
      var resolved = undefined;
      creationPromise.then(function(value){
        resolved = value;
      });
      scope.$apply();
      expect(httpPostSpy).toHaveBeenCalled();
      expect(restProcessSpy).toHaveBeenCalled();
      expect(resolved).toBeDefined();
      expect(resolved.firstName).toBe('James');
      expect(resolved.lastName).toBe('Donohue');
      expect(resolved.selfLink).toBe("http://localhost:8080/people/2");
    });
  });

  describe('updatePerson', function(){

    beforeEach(function() {
      httpPutSpy.and.callFake(function(url, data){
        return {
          then: function(callback) {
            return callback('success');
          }
        }
      });
    });

    it('should update the person', function() {
      var personToUpdate = new ppl.Person({firstName: 'James', lastName: 'Donohue', selfLink: 'http://localhost:8080/people/2'});
      var updatePromise = PeopleService.updatePerson(personToUpdate);
      var resolved = 'defined';
      updatePromise.then(function(value){
        resolved = value;
      });
      scope.$apply();
      expect(httpPutSpy).toHaveBeenCalledWith(personToUpdate.selfLink, JSON.stringify(personToUpdate));
      expect(resolved).toBeUndefined();
    });
  });

  describe('deletePerson', function(){

    beforeEach(function() {
      httpDeleteSpy.and.callFake(function(url){
        return {
          then: function(callback) {
            return callback('deleted');
          }
        }
      });
    });

    it('should update the person', function() {
      var personToDelete = new ppl.Person({firstName: 'James', lastName: 'Donohue', selfLink: 'http://localhost:8080/people/2'});
      var deletePromise = PeopleService.deletePerson(personToDelete);
      var resolved = 'defined';
      deletePromise.then(function(value){
        resolved = value;
      });
      scope.$apply();
      expect(httpDeleteSpy).toHaveBeenCalledWith(personToDelete.selfLink);
      expect(resolved).toBeUndefined();
    });
  });

});
