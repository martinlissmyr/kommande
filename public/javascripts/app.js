/**
 * Kommande App
 * -----------------
 */

 var Kommande = (function($) {
  'use strict';
  var listTemplate = Handlebars.compile(document.getElementById("event-list-template").innerHTML);

  var getEvents = function(callback) {
    $.getJSON("events", function(json) {
      var items = {items: json};
      document.getElementById("events").innerHTML = listTemplate(items);
      if (typeof callback !== "undefined") {
        callback.call();
      }
    });
  };

  var init = function() {
    getEvents();
  }();

})(Helpers);