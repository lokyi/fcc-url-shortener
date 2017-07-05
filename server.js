// server.js

// init project
var express = require('express');
var needle = require('needle');
var app = express();

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/:id", function (req, res) {
  var options = { open_timeout: 3000 }

  needle.head('https://goo.gl/' + req.params.id, function(err, resp) {
    if (err) return res.json(err);

    if (resp.statusCode > 400) {
      res.send('Invalid Short Url');
    } else {
      res.redirect('https://goo.gl/' + req.params.id);
    }
  });
});

app.get('/new/*', function (req, res) {
  var options = { headers: { 'content-type': 'application/json' } };
  var body = { longUrl: req.params[0] };
  needle.post('https://www.googleapis.com/urlshortener/v1/url?key=' + process.env.KEY, body, options, function(err, resp) {
    if (err) return res.json(err);
    res.json({short_url: 'https://serious-tune.glitch.me/' + resp.body.id.slice(15), original_url: resp.body.longUrl});
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Timestamp microservice is listening on port ' + listener.address().port);
});
