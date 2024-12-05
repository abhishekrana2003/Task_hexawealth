const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Google Login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Generate a JWT token for the logged-in user
        const token = jwt.sign(
            { id: req.user.id, email: req.user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token expiration
        );

        // Redirect to frontend with the token
        res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`);
    }
);

// Logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.clearCookie('authToken'); // Optional: Clear any cookies set by the frontend
        res.redirect('/'); // Redirect to the homepage or login page
    });
});

module.exports = router;