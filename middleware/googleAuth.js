const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const router = express.Router();

// Google OAuth credentials
const GOOGLE_CLIENT_ID = "553811670174-82u1d0qaelspr7jdeptejvvakcbq2it8.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = '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';
const CALLBACK_URL = 'http://localhost:3000/api/auth/google';

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: CALLBACK_URL,
},
(accessToken, refreshToken, profile, done) => {
  // You can save user data to your database or perform other actions here
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

router.use(require('express-session')({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());

// Set CORS headers manually
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

router.get('/google', (req, res, next) => {
  // Set CORS headers for this route
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:5173'); // Redirect to your React app
  }
);

module.exports = router;
