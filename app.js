var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost:27017/TestExport');

global.dbHelper = require('./models/db-helper');

global.commonInfo = {
    map: require('./map/commonMap')
};

var app = express();

// view engine setup123
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs-mate'));
app.locals._layoutFile = 'shared/_layout'; //全局引用_layout模板
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session 时长为10分钟,这个是以毫秒为单位,这样我们就建立一个session的会话，这是一个全局的设置
app.use(session({ secret: 'joke', key: 'joke_key' ,cookie: { maxAge: 18000000},resave:false,saveUninitialized:true}));
// models
app.use(function(req, res, next){
    res.locals.commonInfo = commonInfo;
    next();
});

// routes
require('./routes-config')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.write(err.message);
        res.end();
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.write(err.message);
    res.end();
});

module.exports = app;