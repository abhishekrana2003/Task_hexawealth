const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and Password are required' });
    }

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Ensure password exists for non-Google users
        if (!user.password) {
            return res.status(400).json({ message: 'Please use Google login for this account.' });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const jwtToken = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ message: 'Login successful', token: jwtToken });
    } catch (err) {
        console.error('Error during login:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Signup route
router.post('/signup', async (req, res) => {
    const { email, password, name, googleId } = req.body;

    // Validate required fields
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        let newUser;

        if (googleId) {
            // Google signup logic
            newUser = new User({ email, googleId, name });
        } else {
            // Traditional signup logic
            if (!password) {
                return res.status(400).json({ message: 'Password is required for non-Google users.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            newUser = new User({ email, password: hashedPassword, name });
        }

        // Save the new user to the database
        await newUser.save();

        // Generate a JWT token
        const jwtToken = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(201).json({ message: 'Signup successful', token: jwtToken });
    } catch (err) {
        console.error('Error during signup:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/getEmail',async (req,res)=>{
    try{
        const {email} = req.body;
        return res.status(200).json({email:email});
    }
    catch(e){
        console.error(e.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
})
module.exports = router;