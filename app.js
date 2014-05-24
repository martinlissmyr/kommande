var express = require('express');
var http = require('http');
var path = require('path');
var getEvents = require("./lib/events");
var app = module.exports = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(express.logger('dev'));
});

app.get('/', function(request, response) {
  response.render("index");
});

app.get('/events', function(request, response) {
  var fetch = getEvents();
  
  fetch.done(function(events) {
    response.json(events);
  });

  fetch.fail(function(status) {
    response.status(500).json(status);
  });

});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});