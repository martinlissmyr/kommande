/**
 * NWS Helpers
 * -----------------
 */

 var Helpers = (function() {
  'use strict';
  var timer;
  var getScrollX = function() { return (document.all) ? document.body.scrollLeft : window.pageXOffset; };
  var getScrollY = function() { return (document.all) ? document.body.scrollTop : window.pageYOffset; };
  var getObjPos = function(elm, c) {
    var x = 0;
    var y = 0;
    while (elm.offsetParent) { x+=elm.offsetLeft; y+=elm.offsetTop; elm=elm.offsetParent; }
    return ((c=="x")?x:y);
  };
  var doScroll = function(x, y) {
    var scrollx = getScrollX();
    var scrolly = getScrollY();
    if (Math.abs(scrollx - x) <= 1 && Math.abs(scrolly - y) <= 1) {
      window.scrollTo(x, y);
    } else {
      window.scrollTo(parseInt(scrollx+(x-scrollx)/2),parseInt(scrolly+(y-scrolly)/2));
      if (scrollx != getScrollX() || scrolly != getScrollY()) {
        timer = setTimeout(function() { doScroll(x, y) }, 50);
      } else {
        window.scrollTo(x, y);
      }
    }
  };
  var scrollTo = function(obj) {
    doScroll(0, getObjPos(obj));
    return false;
  };
  var trigger = function(eventName, elm) {
    if (eventName === "click") {
      // Only supports click as of now
      var evt = document.createEvent("MouseEvents");
      evt.initMouseEvent(eventName, true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      elm.dispatchEvent(evt)
    }
  };
  var get = function(url, callback) {
    var req = new XMLHttpRequest();
    if (!req) return;
    req.open("GET", url, true);
    req.onload = function () {
      if (req.readyState != 4) return;
      if (req.status != 200 && req.status != 304) { return; }
      callback.call(req, req.responseText);
    }
    if (req.readyState == 4) return;
    req.send(null);
  };
  var getJSON = function(url, callback) {
    get(url, function(response) {
      callback.call(this, JSON.parse(response));
    });
  };
  var addClass = function(classname, element) {
    var cn = element.className;
    if (cn.indexOf(classname) != -1 ) { return; } //test for existance
    if (cn != '') { classname = ' ' + classname; } //add a space if the element already has class
    element.className = cn + classname;
  };
  var removeClass = function(classname, element) {
    var cn = element.className;
    var rxp = new RegExp("\\s?\\b"+classname+"\\b", "g");
    cn = cn.replace(rxp, '');
    element.className = cn;
  };
  var closest = function(elem, selector) {
    while (elem) {
      if (elem.webkitMatchesSelector(selector)) {
        return elem;
      } else {
        elem = elem.parentNode;
      }
    }
    return false;
  };
  return {
    trigger: trigger,
    get: get,
    getJSON: getJSON,
    scrollTo: scrollTo,
    addClass: addClass,
    removeClass: removeClass,
    closest: closest
  };
})();