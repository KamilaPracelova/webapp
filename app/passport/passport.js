var FacebookStrategy = require('passport-facebook').Strategy; // Import Passport-Facebook Package
var TwitterStrategy = require('passport-twitter').Strategy; // Import Passport Twitter Package
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy; // Import Passport Google Package
var User = require('../models/user'); // Import User Model
var session = require('express-session'); // Import Express Session Package
var jwt = require('jsonwebtoken'); // Import JWT Package
var secret = 'harrypotter'; // Create custom secret to use with JWT

module.exports = function(app, passport) {
    // Start Passport Configuration Settings
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false } }));
    // End Passport Configuration Settings

    // Serialize users once logged in   
    passport.serializeUser(function(user, done) {
        // Check if the user has an active account
        ///if (user.active) {
            // Check if user's social media account has an error
          ///  if (user.error) {
           ///     token = 'unconfirmed/error'; // Set url to different error page
          ///  } else {
                token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); // If account active, give user token
          ///  }
       /// } else {
         ///   token = 'inactive/error'; // If account not active, provide invalid token for use in redirecting later
       /// }
        done(null, user.id); // Return user object
    });

    // Deserialize Users once logged out    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user); // Complete deserializeUser and return done
        });
    });

    // Facebook Strategy    
	passport.use(new FacebookStrategy({
        clientID: '1083313558464361',
        clientSecret: '758ba6b44100d0f5ac61727c90930c16',
        callbackURL: "http://localhost:8080/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile._json.email }).select('username password email').exec(function(err, user){
            if (err) done(err);

            if (user && user != null){
                done(null, user);  		
            } else {
                done(err);
            }
        });
    }
    ));


    // Twitter Strategy
    passport.use(new TwitterStrategy({
        consumerKey: 'kATnu8l39tQHV4yGMKoe3sxSN',
        consumerSecret: 'Usx6US6kKZJdAdDWMaDSnu2OnfLv8m3JkxP3zaBTV3VOQ5R4f4',
        callbackURL: "http://localhost:8080/auth/twitter/callback",
        userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
    },
    function(token, tokenSecret, profile, done) {
        User.findOne({ email: profile.emails[0].value }).select('username password email').exec(function(err, user){ // email: profile.emails[0].value <- in console only email
        if (err) done(err);

        if (user && user != null){
            done(null, user);     
        } else {
            done(err);
        }
        });
    }
    ));

    // Google Strategy  
    passport.use(new GoogleStrategy({
        clientID: '51159396974-g17mtg0l4k2k74oobmhul7ritkq4hk4e',
        clientSecret: 'vkqE5QPZa9o70ej9nRkPmrSi',
        callbackURL: "http://localhost:8080/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile.emails[0].value }).select('username password email').exec(function(err, user){ // email: profile.emails[0].value <- in console only email
            if (err) done(err);

            if (user && user != null){
                done(null, user);     
            } else {
                done(err);
            }
            });
    }
    ));

    // Google Routes    
    app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/googleerror' }), function(req, res) {
        res.redirect('/google/' + token); // Redirect user with newly assigned token
    });

    // Twitter Routes
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/twittererror' }), function(req, res) {
        res.redirect('/twitter/' + token); // Redirect user with newly assigned token
    });

    // Facebook Routes
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/facebookerror' }), function(req, res) {
        res.redirect('/facebook/' + token); // Redirect user with newly assigned token
    });
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    return passport; // Return Passport Object
};
