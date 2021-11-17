// import necessary models
const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
require('dotenv').config();
const LocalStrategy = require('passport-local');
const jwt = require('jsonwebtoken');

// passport functions for login

passport.use('login', new LocalStrategy(
  {
    username: 'username',
    password: 'password'
  },
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'user not found' });
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          // passwords match! log user in
          return done(null, user);
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" });
        }
      })
    } catch (error) {
      return done(error);
    }
  }
));

// login page GET
exports.login_get = function(req, res, next) {
  res.send({ title: 'Log In' });
}


// login page POST
exports.login_post = async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user ) {
        const error = new Error('An error');
        return next(error);
      }
      req.login(user, {session:false}, async (error) => {
        if (error) { return next(error); }
        const body = {_id: user._id, username: user.username };
        const token = jwt.sign({user: body}, process.env.SECRET);
        
        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
}

// logout
exports.logout = (req, res) => {
  req.logout();
  res.end();
}

