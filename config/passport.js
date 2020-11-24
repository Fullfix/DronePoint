const passport = require('passport');
const passportJwt = require('passport-jwt');
const passportLocal = require('passport-local');
const User = require('../models/User');
require('dotenv/config');

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt
const LocalStrategy = passportLocal.Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
});

// token verification
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
}, async (payload, done) => {
    try {
        let user = await User.findById(payload.id).exec();
        if (user) return done(null, user)
        else return done(null, false);
    }
    catch (err) {
        return done(err, false);
    }
}))

// login
passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    try {
        let user = await User.findOne({ username }).exec();
        if (!user)
            return done(null, false, { message: 'Incorrect username' });
        if (!user.validPassword(password))
            return done(null, false, { message: 'Incorrect password' });
        return done(null, user, { message: 'Logged in successfully' });
    }
    catch (err) {
        return done(err, false);
    }
}))

// sign up
passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
}, async (username, password, done) => {
    try {
        let user = await User.findOne({ username }).exec();
        if (user)
            return done(null, false, { message: 'That username is already taken' });
        let newUser = new User({ username });
        newUser.password = newUser.generateHash(password);
        newUser = await newUser.save();
        return done(null, newUser, { message: 'Signed up successfully' });
    }
    catch (err) {
        return done(err, false);
    }
}));

module.exports = passport;