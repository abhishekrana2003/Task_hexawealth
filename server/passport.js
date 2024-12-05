const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();
module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/authGoogle/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                const newUser = {
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails?.[0]?.value || null,
                };

                try {
                    // Find user by Google ID
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        // User with Google ID exists
                        return done(null, user);
                    } else {
                        // Check if user exists by email
                        user = await User.findOne({ email: newUser.email });

                        if (user) {
                            // If user exists by email, link Google ID
                            user.googleId = profile.id;
                            await user.save();
                            return done(null, user);
                        } else {
                            // Create a new user
                            user = await User.create(newUser);
                            return done(null, user);
                        }
                    }
                } catch (err) {
                    console.error('Error during authentication:', err);
                    return done(err, null);
                }
            }
        )
    );

    // Serialize user to store in session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize user to retrieve from session
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            console.error('Error during deserialization:', err);
            done(err, null);
        }
    });
};