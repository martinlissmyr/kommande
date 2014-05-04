var util = require("./util");
var q = require("q");
var _ = require("lodash");
var moment = require("moment");
var accessToken = process.env.FB_TOKEN;
var events = [];
var now = moment();
moment.lang("sv");

var eventProviders = [
  {
    title: "Under Bron",
    id: "178452072165019"
  },
  {
    title: "Debaser",
    id: "mydebaser"
  },
  {
    title: "Stuga",
    id: "Stugbert"
  },
  {
    title: "Slakthuset",
    id: "slakthuset"
  },
  {
    title: "Fasching",
    id: "jazzclubfasching"
  },
  {
    title: "Nalen",
    id: "NalenStockholm"
  },
  {
    title: "Trädgården",
    id: "Tradgarden"
  },
  {
    title: "F12 Terassen",
    id: "f12terrassen"
  },
  {
    title: "F 1-6 (Fotografiska)",
    id: "f1till6"
  },
  {
    title: "Berns 2:35:1",
    id: "110827168946994"
  },
  {
    title: "Fabriken",
    id: "668078509880277"
  }
];

var eventsUrl = function(obj) {
  return "https://graph.facebook.com/" + obj.id + "/events?access_token=" + accessToken;
}

var sortedEvents = function() {
  return _.sortBy(events, function(event) {
    return new Date(event.start_time).getTime();
  });
}

var cleanTitle = function(title) {
  title = title.replace(/\| Debaser.*/gim, "");
  title = title.replace(/\☿ Debaser.*/gim, "");
  title = title.replace(/\☿\s/gim, "");
  title = title.replace(/\@ Fasching.*/gim, "");
  title = title.replace(/\- [0-9][0-9].*/gim, "");
  title = title.replace(/\| Stockholm \|/gim, "");
  title = title.replace(/\|/gim, " + ");
  return title;
}

var fetchEvents = function(url, place) {
  var deferred = q.defer();
  util.getJSON(url, function(status, response) {
    if (response.data) {
      for (var e in response.data) {
        var event = response.data[e];
        var time = moment(event.start_time);
        if (time.diff(now, "days") > -1) {
          event.prettyDate = time.format("dddd D MMMM, HH.mm");
          event.title = cleanTitle(event.name);
          event.place = place;
          events.push(event);
        }
      }
      deferred.resolve();
    }
  });
  return deferred.promise;
}

module.exports = function() {
  var deferred = q.defer();
  var promises = [];
  events = [];

  if (accessToken) {
    for (var provider in eventProviders) {
      promises.push(fetchEvents(eventsUrl(eventProviders[provider]), eventProviders[provider].title));
    }

    q.allSettled(promises).then(function() {
      deferred.resolve(sortedEvents());
    });
  } else {
    deferred.resolve({});
  }

  return deferred.promise;
}