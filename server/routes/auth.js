const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
router.post('/login',async  (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and Password are required' });
    }

    try {
        // Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // If credentials are valid, send a success response
        const jwtToken = jwt.sign(
            { userId: user._id, email: user.email }, // Payload
            JWT_SECRET, // Secret key
            { expiresIn: '1h' } // Token expiry time
        );
        return res.status(200).json({ message: 'Login successful', token: jwtToken });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and Password are required' });
    }

    try {

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        // Generate a JWT token for the new user
        const jwtToken = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(201).json({ message: 'Signup successful', token: jwtToken });
    } catch (err) {
        console.error('Error during signup:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = router;