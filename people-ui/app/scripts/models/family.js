'use strict';

var ppl = ppl || {};

ppl.Family = function Family(initializationData) {
  var family = {};

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
  family.people = initializationData.people;
  family.selfLink = getSelfLink(initializationData);
  family.id = family.selfLink ? family.selfLink.slice(-1) : -1;

  family.setSelfLink = function setSelfLink(link) {
    family.selfLink = link;
  };

  return family;
};
