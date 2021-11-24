var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const passport = require('passport');
const session = require("express-session");
const cors = require('cors');

require('dotenv').config();

const indexRouter = require('./routes/index')
const blogRouter = require('./routes/blog');
const viewRouter = require('./routes/view');
const createRouter = require('./routes/create');

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

var app = express();

app.use(cors());

app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json({limit: '15mb', extended: false }));
app.use(express.urlencoded({ limit: '15mb', extended: false }));

const mongoose = require('mongoose');
const mongoDB = process.env.DB_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  if (req.headers.hasOwnProperty('x-forwarded-for')) {
    req.redirUrl = req.headers['x-forwarded-proto']
    + "://"
    + req.headers.host    // proxy
    // plus any proxy subdirs if needed 
    + "/"
    + proxy_subdir
    ;
  } else {
    // direct requeset
    req.redirUrl = req.protocol
       + "://"
       + req.headers.host
    ;
 }
 next();
});



app.use('/', indexRouter);
app.use('/blog/', blogRouter);
app.use('/blog/create', passport.authenticate('jwt', { session: false }), createRouter);
app.use('/blog/view', viewRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
