'use strict';

var ppl = ppl || {};

ppl.Person = function Person(initializationData) {
  var person = {};

  function getSelfLink(initializationData) {
    var selfLink;
    if (initializationData._links && initializationData._links.self) {
      selfLink = initializationData._links.self.href;
    } else {
      selfLink = initializationData.selfLink ? initializationData.selfLink : '';
    }
    return selfLink;
  }

  initializationData = initializationData || {};
  person.firstName = initializationData.firstName;
  person.lastName = initializationData.lastName;
  person.selfLink = getSelfLink(initializationData);

  person.setSelfLink = function setSelfLink(link) {
    person.selfLink = link;
  };


  return person;

};
