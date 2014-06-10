var q = require('q');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('connect').session;
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var assimilate = require('assimilate');
var serveStatic = require('serve-static');

var app;
var users = {};
var Customer;
var Appointment;

app = module.exports = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Bootstrap models.
require('./models');

Customer = mongoose.model('customer');
Appointment = mongoose.model('appointment');

app.use('/assets', express.static(__dirname + '/public'));

passport.use(
  new TwitterStrategy({
    consumerKey: 'yH1nkJjtFPQHrCDxbddRncUFM',
    consumerSecret: 'BqqJzuNMAjsivPrENNqQeO2rTZNlRWgEU0RKyKKqXw5rMaI7Uz',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
  }, function(token, tokenSecret, profile, done) {
    users[profile.id] = profile;
    done(null, profile);
  })
);
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  done(null, users[id]);
});

app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'asdflasjkdfh3459p8asdfkjzxc$$$987wefiuy&^%' }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  if (!req.isAuthenticated()) {
    res.redirect('/auth/twitter');
  }
  res.sendfile(__dirname + '/app/index.html');
});

app.use('/locales', function(req, res, next) {
  var app = express();
  app.use(serveStatic(__dirname + '/locales'));

  // English is our development language.
  app.get('/dev/translation.json', function(req, res, next) {
    res.sendfile(__dirname + '/locales/en/translation.json');
  });
  app(req, res, next);
});

app.get('/user', function(req, res) {
  res.send(req.user);
});

// Load authentication routes.
app.use(require('./routes/auth'));

// Load customer routes.
app.use('/customers', function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.send(401);
  }
  return require('./routes/customers')(req, res, next);
});

app.use('/customers', function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.send(401);
  }
  return require('./routes/customers_appointments')(req, res, next);
});
