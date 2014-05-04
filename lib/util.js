var url = require("url");
var http = require("http");
var https = require("https");

module.exports = {
  getHtml: function(endpoint, success, fail) {
    var urlInfo = url.parse(endpoint);
    var options = {
      hostname: urlInfo.host,
      path: urlInfo.path,
      method: "GET",
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
        success.call(null, output);
      });
    });

    req.on('error', function(err) {
      //res.send('error: ' + err.message);
    });

    req.end();
  },
  getJSON: function(endpoint, success, fail) {
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
        success.call(this, res.statusCode, obj);
      });
    });

    req.on('error', function(err) {
      //res.send('error: ' + err.message);
    });

    req.end();
  },
  clean: function(str) {
    if (str) {
      str = str.replace(/\n|\r|\t/gm, "");
      str = str.replace(/^\s+/gm, ""); // ltrim
      str = str.replace(/\s+$/gm, ""); // rtrim
      str = str.replace(/\s{2,}/gm, " "); // remove dbl spaces
      str = str.replace(/<!--.+$-->/gm, ""); // remove comments
    }
    return str;
  }
};