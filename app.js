var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var methodOverride = require('method-override');
var app = express();

app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));     // to support URL-encoded bodies
app.use(morgan('dev')); 					// log every request to the console
app.use(methodOverride()); 					// simulate DELETE and PUT
app.use(express.static(__dirname));
// app.use(express.static(__dirname, '/public'));

mongoose.connect('mongodb://localhost/test', function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});

routes = require('./routes/animes')(app);

app.get('/', function(req, res){
  res.render('index.html');
});

app.post('/test', function(req, res){
  // res.render('');
  console.log(req.body.msg);
  res.send('hello!');
});

var server = app.listen(5000, function () {

  var host = server.address().address
  var port = server.address().port

  // console.log(json_data ? json_data.length : 'json_data is null or undefined');
  console.log('Example app listening at http://%s:%s', host, port)

});
