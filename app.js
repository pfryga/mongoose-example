var express = require('express');
var mongoose = require('mongoose');
var app = express();

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', function (callback) {
  console.log('db connection opened!');
});

var Cat = mongoose.model('Cat', {
    name: String
});

app.get('/ping', function(req, res) {
    res.send('pong');
});

app.post('/insert/:name', function(req, res) {
    var kitty = new Cat({
        name: req.params.name
    });

    kitty.save(function () {
        console.log('inserted: ' + req.params.name);
        res.send('inserted: ' + req.params.name);
    });
});

app.post('/delete/:name', function(req, res) {
    Cat.where().findOneAndRemove({
        name: req.params.name
    }, function () {
        console.log('removed: ' + req.params.name);
        res.send('removed: ' + req.params.name);
    });
});

app.post('/delete-all/:name', function(req, res) {
    Cat.find({
        name: req.params.name
    }).remove(function () {
        console.log('removed: ' + req.params.name);
        res.send('removed: ' + req.params.name);
    });
});

app.listen(3000, function () {
    console.log('server started!');
});
