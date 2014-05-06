var express = require('express');

var router = express.Router();

var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/talk2talk');

var routes = require('./routes/index');
var users = require('./routes/users');
var loginRetry = require('./routes/loginRetry');
// var posts = require('./routes/posts');
// var newpost = require('./routes/newpost');

var app = express();

// view engine setup
app.set('title', 'Talk 2 Talk');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "qwerty" }));

// make db accessible
app.use(function(req, res, next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/loginRetry', loginRetry);
// app.use('/posts', posts);
// app.use('/newpost', newpost);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

