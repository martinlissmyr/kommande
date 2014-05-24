var url = require("url");
var http = require("http");
var https = require("https");
var q = require("q");

module.exports = {
  getJSON: function(endpoint, success, fail) {
    var deferred = q.defer();
    var urlInfo = url.parse(endpoint);
    var options = {
      hostname: urlInfo.host,
      path: urlInfo.path,
      method: "GET",
      headers: { 'Content-Type': 'application/json' },
      port: urlInfo.protocol == "https:" ? 443 : 80
    };

    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function(res) {
      var output = '';
      res.setEncoding('utf8');

      res.on('data', function (chunk) {
        output += chunk;
      });

      res.on('end', function() {
        var obj = JSON.parse(output);
        deferred.resolve(obj);
        if (success) {
          success.call(this, res.statusCode, obj);
        }
      });
    });

    req.on('error', function(err) {
      deferred.reject(err);
      if (fail) {
        fail.call(this, err);
      }
    });

    req.end();
    return deferred.promise;
  }
};