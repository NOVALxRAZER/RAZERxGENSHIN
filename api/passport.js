const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport")
const mongoose = require("mongoose")
const GoogleUser = require("../api/models/GoogleUser")

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8500/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        const newUser = {
            googleId: profile.id,
            displayName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }
        try {
            let user = await GoogleUser.findOne({ googleId: profile.id })
            if(user) {
                done(null, user)
            }else{
                user = await GoogleUser.create(newUser)
                done(null, user)
            }
        } catch (err) {
            console.log(err)
        }
    },
    ));

    passport.serializeUser((user, done) => {
        done(null, user)
    });

    passport.deserializeUser((id, done) => {
        GoogleUser.findById(id, (err, user) => done(err, user))
    });
}