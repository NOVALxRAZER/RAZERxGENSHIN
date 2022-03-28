const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport")
const mongoose = require("mongoose")
const GoogleUser = require("./models/GoogleUser")

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://151.106.120.124:8500/auth/google/callback",
    },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile, "ini profile")
            // console.log(accessToken, "access token")
            const newUser = {
                googleId: profile.id,
                email: profile.emails[0].value,
                username: profile.displayName,
                firstName: profile.name.familyName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value,
            }
            try {
                let user = await GoogleUser.findOne({ googleId: profile.id })
                if (user) {
                    done(null, user)
                } else {
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