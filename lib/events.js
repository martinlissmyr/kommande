var util = require("./util");
var q = require("q");
var _ = require("lodash");
var moment = require("moment");
var now = moment();
var eventProviders = require("./providers");
var accessToken = process.env.FB_TOKEN;

// Set locale
moment.lang("sv");

// Generate API URL for a specific provider 
var apiUrl = function(obj) {
  return "https://graph.facebook.com/" + obj.id + "/events?access_token=" + accessToken;
};

// Sort all events
var sortEvents = function(events) {
  return _.sortBy(events, function(event) {
    return new Date(event.start_time).getTime();
  });
};

// Clean titles from crap
var cleanTitle = function(title) {
  title = title.replace(/\| Debaser.*/gim, "");
  title = title.replace(/\☿ Debaser.*/gim, "");
  title = title.replace(/\☿\s/gim, "");
  title = title.replace(/\@ Fasching.*/gim, "");
  title = title.replace(/\- [0-9][0-9].*/gim, "");
  title = title.replace(/\| Stockholm \|/gim, "");
  title = title.replace(/\|/gim, " + ");
  return title;
};

// Fetch events for a provider
var fetchEvents = function(provider) {
  var deferred = q.defer();
  var fetch = util.getJSON(apiUrl(provider));

  fetch.done(function(response) {
    if (response.data) {
      // Parse the events
      var events = _.filter(response.data, function(event) {
        var time = moment(event.start_time);
        event.prettyDate = time.format("dddd D MMMM, HH.mm");
        event.title = cleanTitle(event.name);
        event.place = provider.title;
        return time.diff(now, "days") > -1;
      });
      deferred.resolve(events);
    } else {
      // If no events are returned
      deferred.resolve([]);
    }
  });

  fetch.fail(function() {
    deferred.reject();
  });

  return deferred.promise;
}

// Fetch events for all providers 
var fetchAll = function() {
  var deferred = q.defer();
  var fetch = q.all(_.map(eventProviders, fetchEvents));

  fetch.done(function(data) {
    var events = sortEvents(_.flatten(data, true));
    deferred.resolve(events);
  });

  fetch.fail(function() {
    deferred.reject( { error: "Stuff broken"} );
  });

  return deferred.promise;
};


module.exports = function() {
  if (accessToken) {
    return fetchAll();
  } else {
    return q.reject( { error: "Missing token"} );
  }
}