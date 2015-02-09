var express = require('express');
var mongoose = require('mongoose');
var app = express();

app.use(express.static('public'));
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', function (callback) {
  console.log('db connection opened!');
});

var Cat = mongoose.model('Cat', {
    name: String
});

app.use('/ping', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
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

app.post('/get/:name', function(req, res) {
    Cat.where({
        name: req.params.name
    }).findOne(function (err, elem) {
        if (err) return res.send(err);
        if (elem) {
            res.send('element: ' + elem);
        }
    });
});

app.post('/get-all/:name', function(req, res) {
    Cat.where({
        name: req.params.name
    }).find(function (err, elem) {
        if (err) return res.send(err);
        if (elem) {
            var response = {
                'collection': req.params.name,
                'items': elem
            };
            res.send(response);
        }
    });
});

app.post('/update/:key/:value', function(req, res) {
    Cat.findOneAndUpdate({
        name: req.params.key
    }, {
        name: req.params.value
    }, {
        upsert: true
    }, function() {
        console.log('updated: ' + req.params.key);
        res.send('updated: ' + req.params.key);
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
